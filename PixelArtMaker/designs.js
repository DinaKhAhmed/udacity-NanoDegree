// Select color input
let chosenColor = $('#colorPicker').val();

// Select size input
let rowsNumber = $('#input_height').val();
let columnsNumber = $('#input_width').val();

//getting table with ID pixel_canvas with Javascript in order to use insertRow
let tableContainer = document.getElementById("pixel_canvas");
// When size is submitted by the user, call makeGrid()
$('#sizePicker').submit(function (e) {
    //prevent Page reload on submit
    e.preventDefault();
    makeGrid();
});

function makeGrid() {
    //clear table in case of redrawing
    $("#pixel_canvas tr").remove();

    //get inputs updated values
    rowsNumber = $('#input_height').val();
    columnsNumber = $('#input_width').val();
    console.log(rowsNumber + "And Columns : " + columnsNumber)
    // Your code goes here!
    for (row = 0; row < rowsNumber; row++) {
        let rowRendered = tableContainer.insertRow(row);

        for (column = 0; column < columnsNumber; column++) {
            rowRendered.insertCell(column);
        }

    }

}

// Add click event to dynamically generated cells
$("#pixel_canvas").on("click", "td", function (e) {
    e.target.style.background = $('#colorPicker').val();
});
