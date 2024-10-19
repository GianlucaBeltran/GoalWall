import {
  createRef,
  Dispatch,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { socket } from "./helpers/socket";
import { Goal } from "./types/data.types";
import { motion, useAnimationFrame } from "framer-motion";

import "./App.css";
import { url } from "./constants/apiEndpoints";
import { categories } from "./constants/categories";

function GoalItem({
  goal,
  goalIndex,
  setFinishedGoal,
  setCanPushNew,
  baseSpeed = 15,
}: {
  goal: Goal;
  goalIndex: number;
  setFinishedGoal: Dispatch<React.SetStateAction<boolean>>;
  setCanPushNew: Dispatch<React.SetStateAction<boolean>>;
  baseSpeed?: number;
}) {
  const [goalWidth, setGoalWidth] = useState<number | undefined>();
  const [goalHeight, setGoalHeight] = useState<number | undefined>();
  const [pushed, setPushed] = useState(false);

  const goalRef = useRef<HTMLDivElement | null>(null);

  useAnimationFrame((time, delta) => {
    if (pushed) return;
    if (!goalWidth) return;
    if (!goalRef.current) return;
    if (goalRef.current.getBoundingClientRect().x === 0) return;
    if (
      goalRef.current.getBoundingClientRect().x <
      window.innerWidth - goalWidth - 350
    ) {
      setPushed(true);
      setCanPushNew(true);
    }
  });

  useLayoutEffect(() => {
    if (goalRef.current) {
      const goalInfo = goalRef.current.getBoundingClientRect();
      setGoalHeight(goalInfo.height);
      setGoalWidth(goalInfo.width);
    }
  }, [goalRef.current]);

  const goalColor =
    goal.categories &&
    goal.categories.length > 0 &&
    categories[goal.categories[0].name]
      ? categories[goal.categories[0].name].color
      : "#81ffd1";

  const reactionsSet = new Set(goal.reactions.map((reaction) => reaction.type));
  const sortedReactions = Array.from(reactionsSet).sort().reverse();

  const animationDuration = baseSpeed + (goalWidth! / 100 || 0);

  return (
    <motion.div
      ref={goalRef}
      key={goal.id}
      className="goal"
      animate={{
        x: [window.innerWidth + 10, -(goalWidth || 0) - 10],
      }}
      transition={{
        duration: animationDuration,
        ease: "linear",
      }}
      onAnimationComplete={() => {
        setFinishedGoal(true);
      }}
      style={{
        background: `${goalColor}`,
        boxShadow: `0px 0px 4px 0px ${goalColor}, 0px 0px 15px 0px ${goalColor}`,
      }}
    >
      <img src={url + "/user/avatar/" + goal.avatarFileName} />
      <p className="goal-title">{goal.description}</p>
      <div className="reactions" style={{ top: -((goalHeight || 100) / 2) }}>
        {sortedReactions.map((reaction, index) => (
          <p
            key={index}
            className="reaction"
            style={{
              right: index * 35,
              zIndex: sortedReactions.length - index,
            }}
          >
            {reaction}
          </p>
        ))}
        {/* <p style={{ top: 20, position: "absolute" }}>{animationDuration}</p> */}
      </div>
    </motion.div>
  );
}

function GoalPathContainer({
  goals,
  pathIndex,
  baseSpeed = 15,
}: {
  goals: Goal[];
  pathIndex: number;
  baseSpeed?: number;
}) {
  const [animatingGoals, setAnimatingGoals] = useState<Goal[]>([]);
  const [finishedGoal, setFinishedGoal] = useState<boolean>(false);
  const [canPushNew, setCanPushNew] = useState(false);
  const [currentIndex, setCurrenIndex] = useState(0);

  useEffect(() => {
    if (animatingGoals.length) return;
    setAnimatingGoals(goals.slice(0, 1));
    setCurrenIndex(1);
  }, [goals, animatingGoals]);

  useEffect(() => {
    if (finishedGoal) {
      setAnimatingGoals(animatingGoals.slice(1));
      setFinishedGoal(false);
    }
  }, [finishedGoal]);

  useEffect(() => {
    if (goals.length < 3) return;
    if (canPushNew) {
      console.log("pushing", goals[currentIndex % goals.length]);
      setAnimatingGoals([
        ...animatingGoals,
        goals[currentIndex % goals.length],
      ]);
      setCanPushNew(false);
      setCurrenIndex((currentIndex % goals.length) + 1);
    }
  }, [canPushNew]);

  useEffect(() => {
    document.addEventListener("keydown", (ev: KeyboardEvent) => {
      if (ev.key === pathIndex.toString()) {
        setAnimatingGoals([]);
      }
    });
  }, []);

  return (
    <div className="path">
      {animatingGoals.length &&
        animatingGoals.map((goal, index) => (
          <GoalItem
            key={goal.id}
            goal={goal}
            setFinishedGoal={setFinishedGoal}
            setCanPushNew={setCanPushNew}
            goalIndex={index}
            baseSpeed={baseSpeed}
          />
        ))}
    </div>
  );
}

function App() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [baseSpeed, setBaseSpeed] = useState(15);

  const divContainerRef = createRef<HTMLDivElement>();

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    socket.on("goals", (data) => {
      console.log(data);
      setGoals(data);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("goals");
    };
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", async (ev: KeyboardEvent) => {
      if (ev.key === "f" && divContainerRef.current) {
        if (isFullScreen) {
          await document.exitFullscreen();
          setIsFullScreen(false);
        } else {
          await divContainerRef.current.requestFullscreen();
          setIsFullScreen(true);
        }
      }

      if (ev.key === "Escape" && divContainerRef.current) {
        if (isFullScreen) {
          setIsFullScreen(false);
        }
      }
      if (ev.key === "s") {
        setGoals([...shuffle(goals)]);
      }
      if (ev.key === "=") {
        setBaseSpeed(baseSpeed - 1);
        console.log(baseSpeed);
      }
      if (ev.key === "-") {
        setBaseSpeed(baseSpeed + 1);
        console.log(baseSpeed);
      }
    });

    return () => {
      window.removeEventListener("keydown", () => {});
    };
  }, [isFullScreen, divContainerRef.current, goals, baseSpeed]);

  function shuffle(array: Goal[]) {
    let currentIndex = array.length;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {
      // Pick a remaining element...
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    return array;
  }

  const numberOfPaths = goals.length < 5 ? goals.length : 5;
  const goalsPerPath = goals.length / numberOfPaths;
  console.log(goalsPerPath, "test", numberOfPaths);
  const paths = Array.from({ length: numberOfPaths }, (_, i) => {
    return goals.slice(i * goalsPerPath, (i + 1) * goalsPerPath);
  });
  console.log(paths, goals.length % 5);

  return (
    <div className="App" ref={divContainerRef}>
      <div className="container">
        {goals.length && (
          <>
            {paths.map((path, index) => (
              <GoalPathContainer
                key={index}
                goals={path}
                pathIndex={index}
                baseSpeed={baseSpeed}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
