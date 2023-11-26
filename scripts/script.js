document.addEventListener('DOMContentLoaded', function() {
  // Function to populate or update a table with CSV data
  function populateTable(csvText, tableElementId) {
    let newRows = csvText.split('\n').map(function(row) {
      return row.split(',').map(function(field) {
        return field.replace(/(^"|"$)/g, '').trim();
      });
    });

    let table = document.getElementById(tableElementId);
    for (let i = 1; i < newRows.length; i++) { // Assuming the first row is the header
      let row = table.rows[i] || table.insertRow(-1);
      for (let j = 0; j < newRows[i].length; j++) {
        let cell = row.cells[j] || row.insertCell(-1);

        if (j === 0 && tableElementId === 'todo-table') {
          let checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.checked = newRows[i][j].toLowerCase() === 'done';
          cell.innerHTML = ''; // Clear existing content
          cell.appendChild(checkbox);
          cell.classList.add('checkbox-cell');
        } else {
          if (cell.textContent !== newRows[i][j]) {
            cell.textContent = newRows[i][j];
          }
          if (cell.textContent.toLowerCase() === 'open' || cell.textContent.toLowerCase().includes('detected')) {
            cell.style.backgroundColor = 'red';
            cell.style.color = 'white';
          }

          if (tableElementId === 'todo-table' && j !== 0) {
            makeCellEditable(cell);
          }
        }
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
    if (tableElementId === 'todo-table') {
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
}




  // Function to make a cell editable
  function makeCellEditable(cell) {
    cell.setAttribute('contenteditable', 'true');
  }

  // Function to gather table data
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

  
  // Apply changes button functionality for to-do list
  document.getElementById('apply-changes').addEventListener('click', function() {
    var tableData = getTableData();
    sendData(tableData);
  });

  // Function to fetch CSV data with a cache-busting URL parameter
  function fetchCSVAndUpdateTable(csvFilePath, tableElementId) {
    fetch(`${csvFilePath}?_=${new Date().getTime()}`) // Cache-busting query parameter
      .then(function(response) {
        return response.text();
      })
      .then(function(csvText) {
        populateTable(csvText, tableElementId); // Use the existing populateTable function
      })
      .catch(function(error) {
        console.error('Error fetching the CSV file:', error);
      });
}


  // Fetch and populate the tables
  fetchCSVAndUpdateTable('data/sensors.csv', 'sensor-table');
  fetchCSVAndUpdateTable('data/utilities.csv', 'utilities-table');
  fetchCSVAndUpdateTable('data/security.csv', 'security-table');
  fetchCSVAndUpdateTable('data/to-do.csv', 'todo-table'); // Add this line for the to-do list

   setInterval(function() {
        fetchCSVAndUpdateTable('data/sensors.csv', 'sensor-table');
        fetchCSVAndUpdateTable('data/utilities.csv', 'utilities-table');
        fetchCSVAndUpdateTable('data/security.csv', 'security-table');
    }, 1000);
});
