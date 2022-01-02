/** @format */

import React from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";

class JokeList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { jokes: [] };
    this.generateNewJokes = this.generateNewJokes.bind(this);
    this.vote = this.vote.bind(this);
  }

  // something to happen right at the start...
  componentDidMount() {
    this.getJokes();
  }

  // something to happen each time the component reloads (but not at the start).
  componentDidUpdate() {
    if (this.state.jokes.length === 0) {
      this.getJokes();
    }
  }

  /* get jokes  */
  getJokes = async () => {
    let j = [...this.state.jokes];
    let seenJokes = new Set();
    try {
      while (j.length < this.props.numJokesToGet) {
        let res = await axios.get("https://icanhazdadjoke.com", {
          headers: { Accept: "application/json" },
        });
        let { status, ...jokeObj } = res.data;

        if (!seenJokes.has(jokeObj.id)) {
          seenJokes.add(jokeObj.id);
          j.push({ ...jokeObj, votes: 0 });
        } else {
          console.error("duplicate found!");
        }
      }
      this.setState({ jokes: j });
    } catch (e) {
      console.log(e);
    }
  };

  /* empty joke list and then call getJokes */
  generateNewJokes = () => {
    this.setState({ jokes: [] });
  };

  /* change vote for this id by delta (+1 or -1) */
  vote = (id, delta) => {
    let new_jokes = this.state.jokes.map((j) =>
      j.id === id ? { ...j, votes: j.votes + delta } : j
    );
    this.setState({ jokes: new_jokes });
  };

  /* render: either loading spinner or list of sorted jokes. */
  render() {
    let sortedJokes = [...this.state.jokes].sort((a, b) => b.votes - a.votes);
    return (
      <div className="JokeList">
        <button className="JokeList-getmore" onClick={this.generateNewJokes}>
          Get New Jokes
        </button>
        {sortedJokes.map((j) => (
          <Joke
            text={j.joke}
            key={j.id}
            id={j.id}
            votes={j.votes}
            vote={this.vote}
          />
        ))}
      </div>
    );
  }
}

JokeList.defaultProps = { numJokesToGet: 10 };

export default JokeList;
