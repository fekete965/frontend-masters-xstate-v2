import "../style.css";

// Create a state machine transition function either using:
// - a switch statement (or nested switch statements)
// - or an object (transition lookup table)

// Also, come up with a simple way to "interpret" it, and
// make it an object that you can `.send(...)` events to.

// My Solution
function createMachine() {
  const state = {
    initial: "loading",
    status: "loading",
    states: {
      loading: {
        on: {
          loaded: "playing",
        },
      },
      playing: {
        on: {
          pause: "paused",
        },
      },
      paused: {
        on: {
          play: "playing",
        },
      },
    },
  };

  function send(event) {
    const eventOpt = state.states[state.status];
    const nextStateOpt = eventOpt?.on[event];

    if (nextStateOpt) {
      state.status = nextStateOpt;
    }

    return state.status;
  }

  return {
    send,
  };
}

window.createMachine = createMachine;

// You can also
function loadingBehavior(state, event) {
  if (event.type === "loaded") {
    return {
      ...state,
      value: "playing",
    };
  }

  return state;
}

// Dave's solution
// { value: 'loading', ...}
function transition(state = initialState, event) {
  switch (state.value) {
    case "loading":
      loadingBehavior(state, event);
      break;
    case "playing":
      if (event.type === "pause") {
        return {
          ...state,
          value: "paused",
        };
      }
      break;
    case "paused":
      if (event.type === "play") {
        return {
          ...state,
          value: "playing",
        };
      }
      break;
    default:
      throw new Error("This shouldn't be possible!");
  }

  return state;
}

const initialState = {
  value: "loading",
};

window.transition = transition;

const machine = {
  initial: "loading",
  states: {
    loading: {
      on: {
        LOADED: "playing",
      },
    },
    playing: {
      on: {
        PAUSE: "paused",
      },
    },
    paused: {
      on: {
        PLAY: "playing",
      },
    },
  },
};

function machineTransition(
  state = {
    value: machine.initial,
  },
  event
) {
  const nextStateValue = machine.states[state.value]?.on[event.type];

  if (!nextStateValue) {
    return state;
  }

  return {
    ...state,
    value: nextStateValue,
  };
}

window.machineTransition = machineTransition;

let currentState = { value: machine.initial };

const service = {
  send: (event) => {
    currentState = machineTransition(currentState, event);
    console.log(currentState);
  },
};

window.service = service;
