window.components = window.components || {};
window.components.whiplist = function (doc, win) {
  "use strict";

  var states = {};
  var names = {};
  var politiciansByState = {};
  var politiciansByName = {};

  var makeSortable = function(id) {

    // make sure our IDs are tracked properly
    states[id] = [];
    names[id] = []
    politiciansByState[id] = {};
    politiciansByName[id] = {};


    var politicians = doc.getElementById(id).querySelectorAll('li');

    for (var i=0; i<politicians.length; i++) {
      var state = politicians[i].querySelector('input[name="state"]').value;
      var name  = politicians[i].querySelector('input[name="lastname"]').value;

      if (states[id].indexOf(state) === -1)
        states[id].push(state);

      if (names[id].indexOf(name) === -1)
        names[id].push(name);

      if (typeof politiciansByState[id][state] === "undefined")
        politiciansByState[id][state] = [politicians[i]];
      else
        politiciansByState[id][state].push(politicians[i]);

      if (typeof politiciansByName[id][name] === "undefined")
        politiciansByName[id][name] = [politicians[i]];
      else
        politiciansByName[id][name].push(politicians[i]);
    }
    states[id] = states[id].sort();
    names[id] = names[id].sort();
  }

  var renderSortElement = function(id) {
    var div     = $c('div'),
        label   = $c('label'),
        select  = $c('select'),
        option1 = $c('option'),
        option2 = $c('option');

    div.className = 'sort';

    label.htmlFor = 'order_' + id;
    label.textContent = 'Sort by: ';

    select.id = 'order_' + id;

    option1.value = 'name';
    option1.textContent = 'Name';
    select.appendChild(option1);

    option2.value = 'state';
    option2.textContent = 'State';
    select.appendChild(option2);

    div.appendChild(label);
    div.appendChild(select);

    doc.getElementById('sort_' + id).appendChild(div);
  }

  var bindSortElementEvents = function(id) {
    doc.getElementById('order_' + id).addEventListener('change', function() {
      sort(id);
    });
  }

  var sort = function(id, skipFilter) {
    var whip = doc.getElementById(id);
    var sort = doc.getElementById('order_' + id);

    whip.innerHTML = '';

    if (sort[sort.selectedIndex].value == 'state') {
      var targetArr = states[id];
      var targetObj = politiciansByState[id];
    } else if (sort[sort.selectedIndex].value == 'name') {
      var targetArr = names[id];
      var targetObj = politiciansByName[id];
    }

    for (var i=0; i<targetArr.length; i++)
      for (var j=0; j<targetObj[targetArr[i]].length; j++)
        whip.appendChild(targetObj[targetArr[i]][j]);

    if (!skipFilter)
      filter(id);
  }

  var renderFilterElement = function(id) {
    var div     = $c('div'),
        label   = $c('label'),
        select  = $c('select'),
        option1 = $c('option');

    div.className = 'filter';

    label.htmlFor = 'filter_' + id;
    label.textContent = 'Show state: ';

    select.id = 'filter_' + id;

    option1.value = '';
    option1.textContent = '(all states)';
    select.appendChild(option1);

    for (var i=0; i<states[id].length; i++) {
      var option = $c('option');
      option.value = states[id][i];
      option.textContent = states[id][i];
      select.appendChild(option);
    }

    div.appendChild(label);
    div.appendChild(select);

    doc.getElementById('sort_' + id).appendChild(div);
  }

  var bindFilterElementEvents = function(id) {

    doc.getElementById('filter_' + id).addEventListener('change', function() {
      filter(id);
    });
  }

  var filter = function(id) {
    var whip = doc.getElementById(id);
    var filter = doc.getElementById('filter_' + id);

    sort(id, true);

    if (filter.selectedIndex == 0)
      return;

    var filterState = filter[filter.selectedIndex].value,
        lis         = whip.querySelectorAll('li');

    for (var i=0; i<lis.length; i++) {
      var state = lis[i].querySelector('input[name="state"]').value;

      if (state != filterState) {
        whip.removeChild(lis[i]);
      }
    }
  }

  var init = function() {
    var whiplists = document.querySelectorAll('.whip');

    for (var i=0; i<whiplists.length; i++) {
      var id = whiplists[i]['id'];
      if (doc.getElementById('sort_' + id)) {

        makeSortable(id);

        renderFilterElement(id);
        bindFilterElementEvents(id);

        renderSortElement(id);
        bindSortElementEvents(id);
      }
    }
  }

  init();
};
