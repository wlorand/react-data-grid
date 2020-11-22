import React, { Component } from 'react';

// kendo react packages
import { DropDownList } from '@progress/kendo-react-dropdowns'; // UI

import { Grid, GridColumn } from '@progress/kendo-react-grid'; // Data Grid

import { Window } from '@progress/kendo-react-dialogs'; // Modal Windows

// data utils
import { process } from '@progress/kendo-data-query';

// local data resources (mock data)
import categories from './resources/categories.json';
import products from './resources/products.json';

// themes and styles -- import a css file (style is ala carte)
// import '@progress/kendo-theme-default/dist/all.css';
// import '@progress/kendo-theme-bootstrap/dist/all.css';
import '@progress/kendo-theme-material/dist/all.css';
import './styles/app.css';

class App extends Component {
  // notice no useless constructor or super

  // local component state: TODO: refactor to useState hooks
  state = {
    dropDownListCat: 0, // switch from null to better reflect the type
    gridDataState: {
      sort: [{ field: 'ProductName', dir: 'asc' }], // initial sort
      page: { skip: 0, take: 10 }, // 10 per page ?
    },
    windowVisible: false, // modal window boolean
    gridClickedRow: {},
  };

  // component class methods

  // filter the grid
  handleDropDownChange = (e) => {
    // immutable data
    let newGridDataState = { ...this.state.gridDataState };

    if (e.target.value.CategoryID) {
      newGridDataState.filter = {
        logic: 'and',
        filters: [
          {
            field: 'CategoryID',
            operator: 'eq',
            value: e.target.value.CategoryID,
          },
        ],
      };
      newGridDataState.skip = 0;
    } else {
      newGridDataState.filter = [];
      newGridDataState.skip = 0;
    }

    this.setState({
      dropDownListCat: e.target.value.CategoryID,
      gridDataState: newGridDataState,
    });
  };

  handleGridDataStateChange = (e) => {
    this.setState({ gridDataState: e.data });
  };

  handleGridRowClick = (e) => {
    this.setState({
      windowVisible: true,
      gridClickedRow: e.dataItem,
    });
  };

  closeWdddindow = (e) => {
    this.setState({
      windowVisible: false,
    });
  };

  render() {
    return (
      <div className="app-title">
        <h1>[Kendo] React Data Grid</h1>
        <p>
          <DropDownList
            data={categories}
            dataItemKey="CategoryID"
            textField="CategoryName"
            defaultItem={{ CategoryID: 0, CategoryName: 'Product categories' }}
            onChange={this.handleDropDownChange}
          />
          {/* &nbsp; Selected category ID: <strong>{this.state.dropDownListCat}</strong> */}
        </p>
        <Grid
          data={process(products, this.state.gridDataState)}
          pageable={true}
          sortable={true}
          {...this.state.gridDataState} /* sort and pagination props */
          onDataStateChange={this.handleGridDataStateChange}
          onRowClick={this.handleGridRowClick}
          style={{ height: '400px' }}
        >
          <GridColumn field="ProductName" title="Product Name" />
          <GridColumn field="UnitPrice" title="Price" format="{0:c}" />
          <GridColumn field="UnitsInStock" title="Units in Stock" />
          <GridColumn field="Discontinued" cell={checkboxColumn} />
        </Grid>

        {this.state.windowVisible && (
          <Window
            title="Product Details"
            height={250}
            onClose={(e) => this.setState({ windowVisible: false })}
          >
            <dl style={{ textAlign: 'left' }}>
              <dt>Product Name</dt>
              <dd>{this.state.gridClickedRow.ProductName}</dd>
              <dt>Product ID</dt>
              <dd>{this.state.gridClickedRow.ProductID}</dd>
              <dt>Quantity per Unit</dt>
              <dd>{this.state.gridClickedRow.QuantityPerUnit}</dd>
            </dl>
          </Window>
        )}
      </div>
    );
  }
}

// 2nd Class Component in this file -- bad practice (anti-pattern)
// render disabled checkbox for a data col

class checkboxColumn extends Component {
  render() {
    return (
      <td>
        <input
          type="checkbox"
          checked={this.props.dataItem[this.props.field]}
          disabled="disabled"
        />
      </td>
    );
  }
}

export default App;
