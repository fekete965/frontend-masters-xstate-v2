import "./style.css";
import { assign, createMachine, interpret, send } from "xstate";

// function countBehavior(state, event) {
//   if (event.type === "INC") {
//     return {
//       ...state,
//       count: state.count + 1,
//     };
//   }

//   return state;
// }

// function createActor(behavior, initialState) {
//   let currentState = initialState;
//   const listeners = new Set();

//   return {
//     send: (event) => {
//       currentState = behavior(currentState, event);
//       listeners.forEach((listener) => listener(currentState));
//     },
//     subscribe: (listener) => {
//       listeners.add(listener);
//       listener(currentState);
//     },
//     getSnapshot: () => currentState,
//   };
// }

// const actor = createActor(countBehavior, { count: 42 });

// window.actor = actor;

const callback = (sendBack, receive) => {
  let timeout = null;

  receive((event) => {
    console.log("Received: ", event);

    timeout = setTimeout(() => {
      sendBack({ type: "PING" });
    }, 1000);
  });

  return () => {
    if (timeout == null) return;

    clearTimeout(timeout);
  };
};

const fetchMachine = createMachine({
  initial: "fetching",
  states: {
    fetching: {
      after: {
        1000: "success",
      },
    },
    success: {
      type: "final",
      data: {
        count: 42,
      },
    },
  },
});

const machine = createMachine({
  initial: "loading",
  states: {
    loading: {
      invoke: {
        id: "fetchNumber",
        src: fetchMachine,
        onDone: {
          target: "success",
          actions: (_, event) => {
            console.log("DONE!", event);
          },
        },
      },
      on: {
        NOTIFY: {
          actions: send("ANY_EVENT", {
            to: "fetchNumber",
          }),
        },
        PING: {
          target: "success",
        },
      },
    },
    success: {},
    cancelled: {},
  },
});

const service = interpret(machine).start();

service.subscribe((state) => {
  console.log(state);
});

window.machine = machine;
window.service = service;
