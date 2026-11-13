
import { useState } from "react";
import {
  Play,
  RotateCcw,
  CheckCircle,
  XCircle,
  Network,
  BookOpen,
  GitBranch
} from "lucide-react";

// DFA Alphabet
const alphabet = ["T", "C", "P", "U", "D", "I", "M"];

// DFA Transitions
const transitions = {
  START: { T: "T", U: "U", I: "I" },

  T: { C: "TC" },
  TC: { P: "TCP_ACCEPT" },

  U: { D: "UD" },
  UD: { P: "UDP_ACCEPT" },

  I: { C: "IC" },
  IC: { M: "ICM" },
  ICM: { P: "ICMP_ACCEPT" }
};

// Accepting States
const acceptingStates = [
  "TCP_ACCEPT",
  "UDP_ACCEPT",
  "ICMP_ACCEPT"
];

// Get Next State
function getNextState(state, symbol) {
  if (state === "REJECT") {
    return "REJECT";
  }

  return transitions[state]?.[symbol] || "REJECT";
}

// DFA Processing
function runDFA(input) {
  const symbols = input.trim().toUpperCase();

  let currentState = "START";

  const trace = [
    {
      state: "START",
      symbol: "START",
      description: "Initial State"
    }
  ];

  for (const symbol of symbols) {
    currentState = getNextState(currentState, symbol);

    trace.push({
      state: currentState,
      symbol,
      description:
        currentState === "REJECT"
          ? `Moved to REJECT state on '${symbol}'`
          : `Input '${symbol}' received`
    });
  }

  const accepted = acceptingStates.includes(currentState);

  if (!accepted && currentState !== "REJECT") {
    currentState = "REJECT";

    trace.push({
      state: "REJECT",
      symbol: "END",
      description: "Input ended in a non-accepting state"
    });
  }

  return {
    accepted,
    finalState: currentState,
    classification: accepted
      ? currentState.replace("_ACCEPT", "")
      : "UNKNOWN",
    trace
  };
}

// Main Component
function DFAVisualizer() {
  const [input, setInput] = useState("TCP");
  const [result, setResult] = useState(null);

  // Run DFA
  const handleRun = () => {
    if (!input.trim()) {
      setResult({
        accepted: false,
        finalState: "REJECT",
        classification: "UNKNOWN",
        trace: [
          {
            state: "START",
            symbol: "START",
            description: "Initial State"
          },
          {
            state: "REJECT",
            symbol: "END",
            description: "Empty input is not accepted"
          }
        ]
      });
      return;
    }

    setResult(runDFA(input));
  };

  // Reset
  const handleReset = () => {
    setInput("");
    setResult(null);
  };

  return (
    <div className="page">

      {/* Header */}
      <div className="page-heading">
        <div>
          <h1>Finite Automata Visualizer</h1>
          <p>
            Network Protocol Recognition using
            Deterministic Finite Automata.
          </p>
        </div>

        <Network size={35} color="#2379d3" />
      </div>

      {/* Protocol Input */}
      <div className="dfa-card">

        <h2>
          <Play size={20} />
          Protocol Input
        </h2>

        <label>Enter Protocol String</label>

        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setResult(null);
          }}
          placeholder="Enter TCP, UDP or ICMP"
        />

        <div className="dfa-actions">

          <button onClick={handleRun}>
            <Play size={16} />
            Run DFA
          </button>

          <button
            className="reset-btn"
            onClick={handleReset}
          >
            <RotateCcw size={16} />
            Reset
          </button>

        </div>
      </div>

      {/* Result */}
      {result && (
        <>
          <div
            className={`dfa-result ${
              result.accepted ? "accepted" : "rejected"
            }`}
          >

            {result.accepted ? (
              <CheckCircle size={30} />
            ) : (
              <XCircle size={30} />
            )}

            <div>
              <h2>
                {result.accepted
                  ? "String Accepted"
                  : "String Rejected"}
              </h2>

              <p>
                Final State: <strong>{result.finalState}</strong>
              </p>

              <p>
                Classification:{" "}
                <strong>{result.classification}</strong>
              </p>
            </div>

          </div>

          {/* State Transition Sequence */}
          <div className="dfa-card">

            <h2>
              <GitBranch size={21} />
              State Transition Sequence
            </h2>

            <p className="dfa-description">
              Input symbols and corresponding state transitions.
            </p>

            <div className="transition-list">

              {result.trace.map((step, index) => (
                <div
                  className="transition-item"
                  key={index}
                >

                  <div
                    className={`state-node ${
                      step.state.includes("ACCEPT")
                        ? "accept-node"
                        : step.state === "REJECT"
                        ? "reject-node"
                        : ""
                    }`}
                  >
                    {step.state}
                  </div>

                  {index < result.trace.length - 1 && (
                    <div className="transition-arrow">
                      <span>↓</span>
                      <small>
                        {result.trace[index + 1].symbol}
                      </small>
                    </div>
                  )}

                </div>
              ))}

            </div>
          </div>

          {/* Transition Details */}
          <div className="dfa-card">

            <h2>Transition Details</h2>

            <div className="table-wrapper">

              <table>
                <thead>
                  <tr>
                    <th>Step</th>
                    <th>Input</th>
                    <th>State</th>
                    <th>Description</th>
                  </tr>
                </thead>

                <tbody>
                  {result.trace.map((step, index) => (
                    <tr key={index}>
                      <td>{index}</td>
                      <td>{step.symbol}</td>
                      <td>{step.state}</td>
                      <td>{step.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

            </div>
          </div>
        </>
      )}

      {/* Simple DFA Transition Table */}
      <div className="dfa-card">

        <h2>DFA Transition Table</h2>

        <p className="dfa-description">
          Simple representation of protocol state transitions.
        </p>

        <div className="table-wrapper">

          <table>
            <thead>
              <tr>
                <th>Current State</th>
                <th>Input</th>
                <th>Next State</th>
              </tr>
            </thead>

            <tbody>

              {Object.entries(transitions).flatMap(
                ([state, rules]) =>
                  Object.entries(rules).map(
                    ([symbol, nextState]) => (
                      <tr key={`${state}-${symbol}`}>
                        <td>{state}</td>
                        <td>{symbol}</td>
                        <td>{nextState}</td>
                      </tr>
                    )
                  )
              )}

              <tr>
                <td>All other transitions</td>
                <td>Other symbols</td>
                <td>REJECT</td>
              </tr>

              <tr>
                <td>REJECT</td>
                <td>Any symbol</td>
                <td>REJECT</td>
              </tr>

            </tbody>
          </table>

        </div>
      </div>

      {/* Formal Automata Theory */}
      <div className="dfa-card theory-card">

        <h2>
          <BookOpen size={22} />
          Formal Automata Theory
        </h2>

        <p className="dfa-description">
          This module uses Deterministic Finite Automata
          to recognize predefined network protocol names.
        </p>

        <div className="theory-grid">

          <div className="theory-item">
            <span>Automata Type</span>
            <strong>
              Deterministic Finite Automaton (DFA)
            </strong>
          </div>

          <div className="theory-item">
            <span>Alphabet (Σ)</span>
            <strong>{`{T, C, P, U, D, I, M}`}</strong>
          </div>

          <div className="theory-item">
            <span>Initial State (q₀)</span>
            <strong>START</strong>
          </div>

          <div className="theory-item">
            <span>Accepting States (F)</span>
            <strong>
              TCP_ACCEPT, UDP_ACCEPT, ICMP_ACCEPT
            </strong>
          </div>

          <div className="theory-item">
            <span>Dead State</span>
            <strong>REJECT</strong>
          </div>

          <div className="theory-item">
            <span>Total States</span>
            <strong>12</strong>
          </div>

        </div>

        <div className="theory-formula">

          <h3>Mathematical Representation</h3>

          <p><strong>M = (Q, Σ, δ, q₀, F)</strong></p>

          <ul>
            <li><strong>Q:</strong> Set of all states.</li>
            <li><strong>Σ:</strong> Input alphabet.</li>
            <li><strong>δ:</strong> Transition function.</li>
            <li><strong>q₀:</strong> Initial state (START).</li>
            <li><strong>F:</strong> Set of accepting states.</li>
          </ul>

        </div>

        <div className="theory-formula">

          <h3>Purpose of DFA</h3>

          <p>
            To recognize predefined network protocol names
            using finite-state transitions.
          </p>

          <p>
            If the input reaches an accepting state,
            the protocol is recognized. Otherwise,
            the input is rejected.
          </p>

        </div>

      </div>

    </div>
  );
}

export default DFAVisualizer;
