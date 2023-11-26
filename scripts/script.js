document.addEventListener('DOMContentLoaded', function() {

  // Function to fetch and update tables with CSV data
  var lastFetchedData = {
    'sensor-table': '',
    'utilities-table': '',
    'security-table': '',
    'todo-table': ''
  };

  // Function to fetch and update tables with CSV data
  function fetchCSVAndUpdateTable(csvFilePath, tableElementId) {
    fetch(`${csvFilePath}?_=${new Date().getTime()}`) // Cache-busting query parameter
      .then(function(response) {
        return response.text();
      })
      .then(function(csvText) {
        // Update the table only if the data has changed
        if (lastFetchedData[tableElementId] !== csvText) {
          populateTable(csvText, tableElementId);
          lastFetchedData[tableElementId] = csvText; // Update the stored data
        }
      })
      .catch(function(error) {
        console.error('Error fetching the CSV file:', error);
      });
  }

  // Function to populate or update a table with CSV data
  function populateTable(csvText, tableElementId) {
    // Process CSV data into rows and cells
    let newRows = csvText.split('\n').map(function(row) {
      return row.split(',').map(function(field) {
        return field.replace(/(^"|"$)/g, '').trim();
      });
    });

    // Update table rows and cells
    let table = document.getElementById(tableElementId);
    for (let i = 1; i < newRows.length; i++) { // Assuming the first row is the header
      let row = table.rows[i] || table.insertRow(-1);
      for (let j = 0; j < newRows[i].length; j++) {
        let cell = row.cells[j] || row.insertCell(-1);
        updateCell(cell, newRows[i][j], j, tableElementId);
      }
      // Remove extra cells if new data has fewer columns
      while (row.cells.length > newRows[i].length) {
        row.deleteCell(-1);
      }
    }
    // Remove extra rows if new data has fewer rows
    while (table.rows.length > newRows.length) {
      table.deleteRow(-1);
    }

    // Add a default new row in the todo-table
    if (tableElementId === 'todo-table') {
      addDefaultTodoRow(table);
    }
  }

  // Function to update individual cells in the table
  function updateCell(cell, cellData, columnIndex, tableElementId) {
    // Special handling for the todo-table's first column (checkbox)
    if (columnIndex === 0 && tableElementId === 'todo-table') {
      updateCheckboxCell(cell, cellData);
    } else {
      updateTextCell(cell, cellData);
    }

    // Apply additional formatting if necessary
    if (cellData.toLowerCase() === 'open' || cellData.toLowerCase().includes('detected')) {
      cell.style.backgroundColor = 'red';
      cell.style.color = 'white';
    }

    // Make cells editable for todo-table, excluding the checkbox column
    if (tableElementId === 'todo-table' && columnIndex !== 0) {
      makeCellEditable(cell);
    }
  }

  // Function to update a checkbox cell
  function updateCheckboxCell(cell, cellData) {
    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = cellData.toLowerCase() === 'done';
    cell.innerHTML = ''; // Clear existing content
    cell.appendChild(checkbox);
    cell.classList.add('checkbox-cell');
  }

  // Function to update a regular text cell
  function updateTextCell(cell, cellData) {
    if (cell.textContent !== cellData) {
      cell.textContent = cellData;
    }
  }

  // Function to add a default new row in the todo-table
  function addDefaultTodoRow(table) {
    let defaultRow = table.insertRow(-1);
    for (let i = 0; i < 4; i++) { // Assuming there are 4 columns in total
      let cell = defaultRow.insertCell(-1);
      if (i === 0) { // First column with checkbox
        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        cell.appendChild(checkbox);
      } else {
        makeCellEditable(cell); // Make the other cells editable
      }
    }
  }

  // Function to make a cell editable
  function makeCellEditable(cell) {
    cell.setAttribute('contenteditable', 'true');
  }

  // Function to gather and send table data for the to-do list
  document.getElementById('apply-changes').addEventListener('click', function() {
    var tableData = getTableData();
    sendData(tableData);
  });

  // Function to gather data from the to-do table
  function getTableData() {
    var data = [];
    var table = document.getElementById('todo-table');
    var rows = table.getElementsByTagName('tr');

    for (var i = 1; i < rows.length; i++) {
        var rowCells = rows[i].getElementsByTagName('td');
        var rowData = [];

        for (var j = 0; j < rowCells.length; j++) {
            if (j === 0) { // First column with checkbox
                var checkbox = rowCells[j].getElementsByTagName('input')[0];
                rowData.push(checkbox.checked ? 'done' : '');
            } else {
                var cellData = rowCells[j].innerText || rowCells[j].textContent;
                rowData.push(cellData.trim());
            }
        }

        if (!rowData.every(cell => cell === '')) {
            data.push(rowData);
        }
    }
    return data;
  }

  // Function to send data to the server
  function sendData(data) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "scripts/update_todo.php", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        console.log('Server response:', this.responseText);
      }
    };
    xhr.send(JSON.stringify(data));
  }

  // Initial fetch and populate of the tables
  fetchCSVAndUpdateTable('data/sensors.csv', 'sensor-table');
  fetchCSVAndUpdateTable('data/utilities.csv', 'utilities-table');
  fetchCSVAndUpdateTable('data/security.csv', 'security-table');
  fetchCSVAndUpdateTable('data/to-do.csv', 'todo-table');

  // Refresh the first three tables every 2 seconds
  setInterval(function() {
    fetchCSVAndUpdateTable('data/sensors.csv', 'sensor-table');
    fetchCSVAndUpdateTable('data/utilities.csv', 'utilities-table');
    fetchCSVAndUpdateTable('data/security.csv', 'security-table');
  }, 1000);

});
