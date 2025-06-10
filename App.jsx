import { useReducer } from "react";
import "./App.css";
import { useState } from "react";

const icart = {
  // milk: { qty: 0, aqty: 10, price: 29, total: 0 },
  // egg: { qty: 0, aqty: 30, price: 6, total: 0 },
  // books: { qty: 0, aqty: 16, price: 25, total: 0 },
  // candy: { qty: 0, aqty: 19, price: 5, total: 0 },
  // rice: { qty: 0, aqty: 20, price: 270, total: 0 },
  total: 0,
};
// console.log(Object.keys(icart).length);
function reducer(state, action) {
  switch (action.type) {
    case "additem": {
      return {
        ...state,
        [action.item]: {
          qty: 0,
          price: 0,
          aqty: 0,
          total: 0,
        },
      };
    }
    case "change": {
      // console.log(action.datat);
      return {
        ...state,
        [action.item]: {
          ...action.ivalue,
          [action.datat]: Number(action.value),
        },
      };
    }
    case "kchange": {
      const { [action.oldvalue]: olditem, ...rest } = state;
      console.log(action.newvalue);
      return {
        ...rest,
        [action.newvalue]: olditem,
      };
    }
    case "add": {
      const item = state[action.item];

      return {
        ...state,
        [action.item]: {
          qty: item.qty + 1,
          aqty: item.aqty,
          price: item.price,
          total: item.total + item.price,
        },
        total: state.total + item.price,
      };
    }
    case "del": {
      const item = state[action.item];
      return {
        ...state,
        [action.item]: {
          qty: item.qty - 1,
          aqty: item.aqty,
          price: item.price,
          total: item.total - item.price,
        },
        total: state.total - item.price,
      };
    }
    case "delete": {
      const newstate = { ...state };
      const tcost = newstate[action.item].total;
      delete newstate[action.item];
      return {
        ...newstate,
        total: newstate.total - tcost,
      };
    }
    case "clear": {
      const newstate = { total: 0 };
      Object.entries(state).map(([key, value]) => {
        if (key === "total") return null;
        newstate[key] = {
          ...value,
          qty: 0,
          aqty: value.aqty - value.qty,
          total: 0,
        };
      });
      return newstate;
    }
  }
}
function App() {
  // const uref = useRef();
  const [state, dispatch] = useReducer(reducer, icart);
  const [ui, setUi] = useState("user");
  console.log(state);
  return (
    <>
      <div className="container">
        <div className="nav">
          <h1>Simple Shopping Cart</h1>
          <div
            onClick={() => {
              setUi("user");
            }}
            style={{ cursor: "pointer" }}
          >
            User Interface
          </div>
          <div
            onClick={() => {
              setUi("admin");
            }}
            style={{ cursor: "pointer" }}
          >
            Admin Interface
          </div>
        </div>
        {ui === "user" && (
          <div className="listcontainer">
            <div className="listitems">
              <ul>
                {Object.entries(state).map(([key, value], i) => {
                  if (key === "total") return null;
                  return (
                    <li key={key}>
                      {i} . {key} [{value.price}rs]
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="listbtns">
              <ul>
                {Object.entries(state).map(([key, value]) => {
                  if (key === "total") return null;
                  return (
                    <li key={key}>
                      <button
                        className="btn"
                        onClick={() => {
                          {
                            value.qty > 0 &&
                              dispatch({ type: "del", item: key });
                          }
                        }}
                      >
                        -
                      </button>
                      {value.qty}
                      {value.qty < value.aqty && (
                        <button
                          className="btn"
                          onClick={() => {
                            dispatch({ type: "add", item: key });
                          }}
                        >
                          +
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="totalcosts">
              <ul>
                {Object.entries(state).map(([key, value]) => {
                  if (key === "total") return null;
                  return <li key={key}>{value.total} rs</li>;
                })}
              </ul>
            </div>
            {Object.keys(state).length > 1 ? (
              <div className="total">
                Total Price : {state.total} rs{" "}
                <button
                  className="pay"
                  onClick={() => {
                    if (state.total > 0) {
                      dispatch({ type: "clear" });
                      alert("Payment Successful");
                    }
                  }}
                >
                  Pay
                </button>
              </div>
            ) : (
              <div className="welcome">
                <h1>Welcome to Simple Shopping Cart!</h1>
                <h3>
                  No items available in the store right now. Please check back
                  later!
                </h3>
              </div>
            )}
          </div>
        )}
        {ui === "admin" && (
          <div className="admincontainer">
            <div className="edititem">
              <input
                type="text"
                name="itemname"
                placeholder="Item Name"
                readOnly
              />
              <input type="text" placeholder="Price" readOnly />
              <input type="text" placeholder="Aval Quantity" readOnly />
              <input type="button" value="" />
            </div>
            {Object.entries(state).map(([key, value]) => {
              if (key === "total") return null;
              return (
                <div key={key} className="edititem">
                  <input
                    type="text"
                    name="itemname"
                    placeholder="Item Name"
                    defaultValue={key}
                    onBlur={() => {
                      dispatch({
                        type: "kchange",
                        oldvalue: key,
                        newvalue: event.target.value,
                      });
                    }}
                  />
                  <input
                    type="number"
                    placeholder="Price"
                    defaultValue={value.price}
                    onBlur={() => {
                      dispatch({
                        type: "change",
                        value: event.target.value,
                        ivalue: value,
                        datat: "price",
                        item: key,
                      });
                    }}
                  />
                  <input
                    type="number"
                    placeholder="Aval Quantity"
                    defaultValue={value.aqty}
                    onBlur={() => {
                      dispatch({
                        type: "change",
                        value: event.target.value,
                        ivalue: value,
                        datat: "aqty",
                        item: key,
                      });
                    }}
                  />

                  <input
                    type="button"
                    value="Delete"
                    onClick={() => {
                      dispatch({ type: "delete", item: key });
                    }}
                  />
                </div>
              );
            })}
            <div className="addsave">
              <input
                type="button"
                value="Add item"
                onClick={() => {
                  const itemname = prompt("enter item name");
                  dispatch({ type: "additem", item: itemname });
                }}
              />
              {/* <input type="button" value="Save" onClick={() => {}} /> */}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
