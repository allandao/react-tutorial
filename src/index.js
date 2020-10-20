import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

// Developer Tools -> Click arrow to navigate right -> Use Components or Profiler React Tools

// /*class Square extends React.Component {
//   // All React component classes that have a constructor should start with a super(props) call.
//   // This is because in JavaScript classes, super is always called when defining subclass constructors.
//   // this.state should be considered as private to a React component
//   constructor(props) {
//     super(props);
//     this.state = {
//       value: null,
//     };
//   }

//   render() {
//     return (
//       /* Forgetting () =>  would fire alert each time the component re-renders.
//        * () => is used to pass a function as the onClick property
//        * React will only call this function after a click.
//        */
//       // When calling setState in a component, React automatically updates
//       // the child components inside of it too.
//       <button className = "square" onClick = {() => this.props.onClick()}>
//         {/* this rendered button is a child of the renderSquare method
//             from the Board class.
//         */}
//         {this.props.value}
//       </button>
//     );
//   }
// }

// In React, function components are a simpler way to write components that only contain a render method and don’t have their own state.
// Notice, this.props is changed to props and onClick={() => this.props.onClick()} to a shorter onClick={props.onClick}
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

/* To collect data from multiple children, or to have two child components communicate with 
each other, you need to declare the shared state in their parent component instead. 
The parent component can pass the state back down to the children by using props; this keeps 
the child components in sync with each other and with the parent component. */

// One approach is that Board should just ask each Square for the Square’s state.
// The above method is discouraged, can be buggy. The best case is to store
// the game’s state in the parent Board component instead of in each Square.
class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
    };
  }

  // With this in place, The Square components receive data from the Board class.
  // In React terms, the Square components are now controlled components. The Board has full control over them.
  handleClick(i) {
    const squares = this.state.squares.slice(); // Allow for immutable objects (new objects to track each instance of a board).
    // Hard to detect when mutable objects are changed. Immutable objects also allow us to revist old objects, such as to get the winner of a past game.

    // Return early to ignore click if already won or a square is filled
    // Using const squares as local variable
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      squares: squares,
      // Calling !xIsNext directly does not work as we need to reference the constructor field
      // just like I do in Java.
      xIsNext: !this.state.xIsNext,
    });
  }

  // Each Square will now receive a value prop that will either be 'X', 'O', or null for empty squares.
  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }
  // We split the returned element into multiple lines for readability, and added parentheses so that JavaScript
  // doesn’t insert a semicolon after return and break our code. JavaScript auto adds semicolons.

  render() {
    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player is: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// Check for winner helper function
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// React.component will throw an error
class Instructions extends React.Component {
  render() {
    return <p>Refresh when a player has won</p>;
  }
}

// ========================================

ReactDOM.render(
  // Treat both classes as one element. For ReactDOM, we can only pass in one element
  <React.Fragment>
    <Game />
    <Instructions />
  </React.Fragment>,
  document.getElementById("root")
);
