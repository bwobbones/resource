/* globals appServices, JobDescriptionMissingMandatoryCtrl */
'use strict';

appServices.service('MatrixService', function(PersonnelService, MatrixDataService, _) {

  var rawData;
  var teamProjectData = {};
  var axes;
  var orders;
  var margin = {};

  var matrixService = {

    draw: function(options, element) {
      rawData = MatrixDataService.findAll();
      var filteredOptions = options.experience || options.occupations || options.personnelSearch || options.projectSearch;
      teamProjectData = filteredOptions ? MatrixDataService.filterData(options) : rawData;
      teamProjectData = colour(teamProjectData);
      matrixService.redraw(options, element);
    },

    redraw: function(options, element) {

      var screenWidth = d3.select('#matrixHolder').style("width").slice(0, -2);
      if (MatrixDataService.findDataByType('projects').length > 0) {
        d3.select("svg").remove();
        var fontSize = calculateFontSize(width, options, screenWidth);
        margin.top = findTopMargin(fontSize);
        margin.left = findLeftMargin(fontSize);
        var width = determineWidth(options, screenWidth);
        var height = determineHeight(width);
        var svg = createSVG(width, height);
        var graph = createGraph(svg);
        orders = orderData(options);
        axes = findPersonnelProjectGrid(width, height);
        findIntersectionCoordinates();
        drawLargeRectangle(graph, width, height);
        drawRows(graph, width, fontSize, options, element);
        drawColumns(graph, width, height, fontSize, options, element);

        element.on('$destroy', function () {
          svg.remove();
        });
      }
    },

    findProjectSeparators: function(options) {
      var memoKey = '';
      _.each(options.experience, function(experience) {
        memoKey = memoKey + experience.selected;
      });
      return findProjectSeparatorsMemoized('experience' + memoKey + options.zoomIn);
    },

    findPersonnelSeparators: function() {
      var axes = matrixService.getAxes();

      var occupationCounts = MatrixDataService.countDataByFieldType('personnel', 'occupation');
      var occupationKeys = _.keys(occupationCounts);
      occupationKeys = _.sortBy(occupationKeys, function(key) {
        return key;
      });

      var separators = [];
      var cumulativeCount = 0;

      _.each(occupationKeys, function(key) {
        cumulativeCount = cumulativeCount + occupationCounts[key] * axes.y.rangeBand();
        var occupation = {
          name: key,
          personnelCount: occupationCounts[key],
          scaledPersonnelCount: occupationCounts[key] * axes.y.rangeBand(),
          cumulativeCount: cumulativeCount
        };
        separators.push(occupation);
      });

      return separators;
    },

    getAxes: function() {
      return axes;
    }

  };

  function findTopMargin(fontSize) {

    var longestProjectName = [{ name: MatrixDataService.findLongestField(['name'], 'projects') }];
    var maxProjectNameLength = 0;
    d3.select('#mainWindow').
      append("svg").
      data(longestProjectName).
      append("text").
      text(function(d, i) {
        return d.name;
      }).
      attr("font-family", "sans-serif").
      attr("font-size", fontSize).
      each(function(d) {
        maxProjectNameLength = this.getBBox().width;
      });

    d3.selectAll('svg').remove();

    return maxProjectNameLength + 40;
  }

  function findLeftMargin(fontSize) {

    var maxNameOccupation = [{ name: MatrixDataService.findLongestField(['name', 'occupation'], 'personnel') }];

    var maxNameLength = 0;
    d3.select('#mainWindow').
      append("svg").
      data(maxNameOccupation).
      append("text").
      text(function(d, i) {
        return maxNameOccupation[0].name;
      }).
      attr("font-family", "sans-serif").
      attr("font-size", fontSize).
      each(function(d) {
        maxNameLength = this.getBBox().width;
      });

    d3.selectAll('svg').remove();

    return maxNameLength + 40;
  }

  function colour(uncolouredData) {
    var d3Colour = d3.scale.category20();
    var colourIndex = 0;

    _.each(uncolouredData.projects, function(data, index) {
      colourIndex = colourIndex + 1;
      uncolouredData.projects[index].colour = d3Colour(colourIndex);
    });

    return uncolouredData;
  }

  function determineWidth(options, screenWidth) {
    var projectLength = MatrixDataService.countDataByType('projects');
    var width = projectLength * 16 + margin.left; // 15 pixel minimum + 1 for the line
    if (options.zoomIn && width > screenWidth) {
      width = screenWidth;
    }

    return parseFloat(width);
  }

  function calculateFontSize(width, options, screenWidth) {
    var fontSize = '6px';
    if (width < screenWidth || !options.zoomIn) {
      fontSize = '12px';
    }
    return fontSize;
  }

  function determineHeight(width) {
    var height = (((width - margin.left) / MatrixDataService.countDataByType('projects')) *
      MatrixDataService.countDataByType('personnel')) + margin.top;
    return height;
  }

  function createSVG(width, height) {
    return d3.select('#matrixHolder')
      .append("svg")
      .attr("width", width)
      .attr("height", height);
  }

  function createGraph(svg) {
    return svg.append("g").
      attr("transform", "translate(" + margin.left + "," + margin.top + ")"); // this is to allow for the text
  }

  function orderData(options) {

    var personnelData = MatrixDataService.findDataByType('personnel');
    var projectData  = MatrixDataService.findDataByType('projects');

    var order = {
      personnel: getPersonnelStrategy(options.selectedPersonnelOrder, personnelData),
      project: getProjectStrategy(options.selectedOrder, projectData)
    }

    if (options.selectedProject) {

      // find the project clicked
      var selectedProject = _.find(projectData, function(project) {
        return project.id === options.selectedProject;
      });

      moveItemsToTop(selectedProject, order, personnelData);
    }

    if (options.selectedPersonnel) {

      // find the personnel clicked
      var selectedPersonnel = _.find(personnelData, function (personnel) {
        return personnel.id === options.selectedPersonnel;
      });
      moveItemsToLeft(selectedPersonnel, order, projectData);
    }

    return order;
  }

  function getPersonnelStrategy(order, personnelData) {
    if (order === 'alphabetical') {
      return d3.range(personnelData.length).sort(function(a, b) {
        return d3.ascending(personnelData[a].name, personnelData[b].name);
      });
    } else {
      return d3.range(personnelData.length).sort(function(a, b) {
        return d3.ascending(
          personnelData[a].occupation + personnelData[a].name,
          personnelData[b].occupation + personnelData[b].name);
      })
    }
  }

  function getProjectStrategy(order, projectData) {
    if (order === 'alphabetical') {
      return d3.range(projectData.length).sort(function(a, b) {
        return d3.ascending(projectData[a].name, projectData[b].name);
      });
    } else {
      return d3.range(projectData.length).sort(function(a, b) {
        return d3.ascending(
          projectData[a].projectExperience + projectData[a].name,
          projectData[b].projectExperience + projectData[b].name);
      });
    }
  }


  function moveItemsToTop(selectedProject, order, personnelData) {

    // find the indexes of the personnel to move
    var moves = [];
    _.each(order.personnel, function(order, index) {
      if (selectedProject) {
        _.each(selectedProject.personnel, function (projectPersonnel) {
          if (personnelData[order].id === projectPersonnel.id) {
            moves.push(index);
          }
        });
      }
    });

    // move them!
    var items = _.pullAt(order.personnel, moves);
    _.each(items, function (item) {
      order.personnel.unshift(item);
    });
  }

  function moveItemsToLeft(selectedPersonnel, order, projectData) {

    // find the indexes of the projects to move
    var moves = [];
    _.each(order.project, function (order, index) {
      if (selectedPersonnel) {
        _.each(selectedPersonnel.roles, function (role) {
          _.each(role.projects, function(roleProject) {
            if (projectData[order].name === roleProject.id &&
              _.contains(roleProject.projectExperience, projectData[order].projectExperience)) {
              moves.push(index);
            }
          });
        });
      }
    });

    // move them!
    var items = _.pullAt(order.project, moves);
    _.each(items, function (item) {
      order.project.unshift(item);
    });
  }

  function findPersonnelProjectGrid(width, height) {
    var wholeWidth = width - margin.left;
    var wholeHeight = height - margin.top;
    var xaxis = d3.scale.ordinal().rangeBands([0, wholeHeight]);
    var yaxis = d3.scale.ordinal().rangeBands([0, wholeWidth]);
    xaxis.domain(orders.personnel);
    yaxis.domain(orders.project);
    return {
      x: xaxis,
      y: yaxis
    };
  }

  function findIntersectionCoordinates() {
    for (var i = 0; i < orders.project.length; i++) {
      var projectPersonnel = teamProjectData.projects[orders.project[i]].personnel;
      teamProjectData.projects[orders.project[i]].ycoords = [];
      for (var j = 0; j < orders.personnel.length; j++) {
        if (_.find(projectPersonnel, { id: teamProjectData.personnel[orders.personnel[j]].id })) {
          teamProjectData.projects[orders.project[i]].ycoords.push({
            y: matrixService.getAxes().x(orders.personnel[j]),
            x: matrixService.getAxes().y(orders.project[i])
          });
        }
      }
    }
  }

  function drawLargeRectangle(svg, width, height) {
    svg.append("rect").
      attr("class", "background").
      attr("width", width - margin.left).
      attr("height", height - margin.top);
  }

  function drawRows(svg, width, fontSize, options, element) {
    var row = initialiseRows(svg, teamProjectData.personnel);
    drawRowLinesAndSeparators(row, width, options);
    drawRowSeparatorText(row, options, teamProjectData.personnel, fontSize);
    drawRowText(row, teamProjectData.personnel, fontSize, options, element);
  }

  function initialiseRows(svg, personnel) {
    return svg.selectAll(".cellRow").
      data(personnel).
      enter().append("g").
      attr("class", "cellRow").
      attr("transform", function(d, i) {
        return "translate(0," + matrixService.getAxes().x(i) + ")";
      });
  }

  function drawRowLinesAndSeparators(row, width, options) {
    row.append("line").
      attr('class', function(d, i) {
        if (options.selectedPersonnelOrder === 'occupation' && isApproximatelyPersonnel(i)) {
          return 'rowSeparator';
        } else {
          return 'rowLine';
        }
      }).
      attr("x1", function(d, i) {
        if (options.selectedPersonnelOrder === 'occupation' && isApproximatelyPersonnel(i)) {
          return -width;
        } else {
          return 0;
        }
      }).
      attr("x2", width).
      attr('stroke-width', function(d, i) {
        if (options.selectedPersonnelOrder === 'occupation' && isApproximatelyPersonnel(i)) {
          return 2;
        } else {
          return 1;
        }
      });
  }

  function drawRowText(row, personnel, fontSize, options, element) {
    row.append("text").
      attr('class', 'rowText').
      attr('id', function (d, i) {
        return 'rowText-' + personnel[i].name.replace(/ /g, '');
      }).
      attr("x", -6).
      attr("y", matrixService.getAxes().x.rangeBand() / 2).
      attr("dy", ".32em").
      attr("text-anchor", "end").
      text(function (d, i) {
        return personnel[i].name;
      }).
      attr("font-family", "sans-serif").
      attr("font-size", fontSize).
      on('mouseover', function(d) {
        d3.select(this).classed("active", true);
      }).
      on('mouseout', function(d) {
        d3.select(this).classed("active", false);
      }).
      on('click', function(d) {
        options.selectedPersonnel = d.id;
        options.selectedOrder = 'alphabetical';
        matrixService.redraw(options, element);
      }).
      each(function(d) {
        d.textWidth = this.getBBox().width;
      });
  }

  function drawRowSeparatorText(row, options, personnel, fontSize) {

    var separators = matrixService.findPersonnelSeparators();

    row.append("text").
      attr('class', 'rowSeparatorText').
      attr("x", -margin.left).
      attr("y", -margin.top + margin.top + fontSize).
      text(function(d, i) {
        if (options.selectedPersonnelOrder === 'occupation' &&
          (matrixService.getAxes().x(i) === 0 || isApproximatelyPersonnel(i))) {
          var occupation = personnel[i].occupation ? personnel[i].occupation : "undefined";
          var occupationCount = _.find(separators, {name: occupation}).personnelCount;
            return (occupation ? occupation : 'None') + ' (' + occupationCount + ')';
        } else {
          return null;
        }
      }).
      attr("font-family", "sans-serif").
      attr("font-size", fontSize).
      style("fill", function(d) {
        return '#E085C2';
      }).
      attr("font-weight", "bold");
  }

  function isApproximatelyPersonnel(yIndex) {
    var seps = _.pluck(matrixService.findPersonnelSeparators(), 'cumulativeCount');
    for (var i = 0; i < seps.length; i++) {
      var separator = seps[i];
      var diff = Math.abs(separator - matrixService.getAxes().x(yIndex));
      if (diff < 0.5) {
        return true;
      }
    };

    return false;
  }

  function drawColumns(svg, width, height, fontSize, options, element) {

    var column = initialiseColumns(svg, teamProjectData.projects);
    drawColumnLinesAndSeparators(column, height, options);
    if (!options.projectSearch) {
      drawColumnSeparatorText(column, options, teamProjectData.projects, fontSize);
    }
    drawColumnText(column, teamProjectData.projects, options, fontSize, element, width, height);

  }

  function initialiseColumns(svg, projects) {
    return svg.
      selectAll(".column").
      data(projects).
      enter().append("g").
      attr("class", "column").
      attr("transform", function(d, i) {
        return "translate(" + matrixService.getAxes().y(i) + ")rotate(-90)";
      }).
      each(colourColumn);
  }

  function colourColumn(column) {

    var axes = matrixService.getAxes();

    var cell = d3.select(this).selectAll(".cell").
      data(column.ycoords).
      enter().append("rect").
      attr("class", "cell").
      attr("x", function(d) {
        return -d.y - (axes.y.rangeBand());
      }).
      attr("width", axes.y.rangeBand() * 0.95).
      attr("height", axes.y.rangeBand() * 0.95).
      style("fill", function(d) {
        return column.colour;
      }).
      on("mouseover", mouseOverCell).
      on("mouseout", mouseOut).
      append("svg:title").
      text(function(d, i) {
        var tooltip = column.name;
        if (column.personnel[i]) {
          var tooltipPersonnel = _.find(teamProjectData.personnel, {id: column.personnel[i].id});
          tooltip = tooltipPersonnel ? column.name + ' - ' + tooltipPersonnel.name : column.name;
        }
        return tooltip;
      });
  }

  function mouseOverCell(cell) {
    d3.selectAll(".rowText").classed("active", function(d, i) {
      return i === orders.personnel[cell.y/matrixService.getAxes().y.rangeBand()];
    });
    d3.selectAll(".columnText").classed("active", function(d, i) {
      return i === orders.project[cell.x/matrixService.getAxes().x.rangeBand()];
    });
  }

  function mouseOut() {
    d3.selectAll("text").classed("active", false);
  }

  function drawColumnLinesAndSeparators(column, height, options) {
    column.append("line").
      attr('class', function(d, i) {
        if (options.selectedOrder === 'experience' && isApproximatelyProject(i, options)) {
          return 'columnSeparator';
        } else {
          return 'columnLine';
        }
      }).
      attr("x1", -height).
      attr("x2", function(d, i) {
        if (options.selectedOrder === 'experience' && isApproximatelyProject(i, options)) {
          return options.zoomIn ? 120 : margin.top;
        } else {
          return null;
        }
      }).
      attr('stroke-width', function(d, i) {
        if (options.selectedOrder === 'experience' && isApproximatelyProject(i, options)) {
          return 2;
        } else {
          return 1;
        }
      });
  }

  function drawColumnSeparatorText(column, options, projects, fontSize) {

    var separators = matrixService.findProjectSeparators(options);

    column.append("text").
      attr('class', 'separatorText').
      attr("x", 5).
      attr('y', -(margin.top * 0.9)).
      text(function(d, i) {
        if (options.selectedOrder === 'experience' &&
          (matrixService.getAxes().y(i) === 0 || isApproximatelyProject(i, options))) {
          var experience = _.find(options.experience, {value: projects[i].projectExperience});
          var experienceCount = _.find(separators, {name: experience.value}).projectCount;
          return experience.name + ' (' + experienceCount + ')';
        } else {
          return null;
        }
      }).
      attr("transform", function(d, i) {
        return "rotate(90)";
      }).
      attr("font-family", "sans-serif").
      attr("font-size", fontSize).
      style("fill", function(d) {
        return '#E085C2';
      }).
      attr("font-weight", "bold");
  }

  function drawColumnText(column, projects, options, fontSize, element, width, height) {
    column.append("text").
      attr("x", 6).
      attr("y", matrixService.getAxes().y.rangeBand() / 2).
      attr("dy", ".32em").
      attr('class', 'columnText').
      attr('id', function(d, i) {
        return 'columnText-' + projects[i].name + projects[i].projectExperience;
      }).
      attr("text-anchor", "start").
      text(function(d, i) {
        var projectExperience = options.projectSearch
          ? ' (' + _.find(options.experience, {value: projects[i].projectExperience}).name + ')'
          : '';
        return projects[i].name + projectExperience;
      }).
      attr("font-family", "sans-serif").
      attr("font-size", fontSize).
      on('mouseover', function(d) {
        d3.select(this).classed("active", true);
      }).
      on('mouseout', function(d) {
        d3.select(this).classed("active", false);
      }).
      on('click', function(d) {
        options.selectedProject = d.id;
        matrixService.redraw(options, element);
      });

  };

  function isApproximatelyProject(yIndex, options) {
    var seps = _.pluck(matrixService.findProjectSeparators(options), 'cumulativeCount');
    for (var i = 0; i < seps.length; i++) {
      var separator = seps[i];
      var diff = Math.abs(separator - matrixService.getAxes().y(yIndex));
      if (diff < 0.5) {
        return true;
      }
    };

    return false;
  }

  var findProjectSeparatorsMemoized = _.memoize(function(memoKey) {
    var axes = matrixService.getAxes();
    var experienceCounts = MatrixDataService.countDataByFieldType('projects', 'projectExperience');
    var experienceKeys = _.keys(experienceCounts);
    experienceKeys = _.sortBy(experienceKeys, function(key) {
      return key;
    });
    var separators = [];
    var cumulativeCount = 0;
    _.each(experienceKeys, function(key) {
      cumulativeCount = cumulativeCount + experienceCounts[key] * axes.y.rangeBand();
      var experience = {
        name: key,
        projectCount: experienceCounts[key],
        scaledProjectCount: experienceCounts[key] * axes.y.rangeBand(),
        cumulativeCount: cumulativeCount
      }
      separators.push(experience);
    });

    return separators;
  });

  return matrixService;
});