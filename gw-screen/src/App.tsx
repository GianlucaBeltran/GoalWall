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
import { urlHome } from "./constants/apiEndpoints";

const categories: Record<string, { id: string; name: string; color: string }> =
  {
    "+ Create a category": {
      id: "0",
      name: "+ Create a category",
      color: "red",
    },
    Wellness: {
      id: "1",
      name: "Wellness",
      color: "white",
    },
    Strength: {
      id: "2",
      name: "Strength",
      color: "#FF8C96",
    },
    Flexibility: {
      id: "3",
      name: "Flexibility",
      color: "#BAF3FF",
    },
    "Mental health": {
      id: "4",
      name: "Mental health",
      color: "#FFE681",
    },

    Motivation: {
      id: "5",
      name: "Motivation",
      color: "#FFC7E0",
    },
    Recovery: {
      id: "6",
      name: "Recovery",
      color: "#C3FF8B",
    },
  };

function GoalItem({
  goal,
  goalIndex,
  setFinishedGoal,
  setCanPushNew,
}: {
  goal: Goal;
  goalIndex: number;
  setFinishedGoal: Dispatch<React.SetStateAction<boolean>>;
  setCanPushNew: Dispatch<React.SetStateAction<boolean>>;
}) {
  const [goalWidth, setGoalWidth] = useState<number | undefined>();
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
      setGoalWidth(goalInfo.width);
    }
  }, [goalRef.current]);

  const goalColor =
    goal.categories &&
    goal.categories.length > 0 &&
    categories[goal.categories[0].name]
      ? categories[goal.categories[0].name].color
      : "#81ffd1";

  return (
    <motion.div
      ref={goalRef}
      key={goal.id}
      className="goal"
      animate={{
        x: [window.innerWidth + 10, -(goalWidth || 0) - 10],
      }}
      transition={{
        duration: 15,
        ease: "linear",
      }}
      onAnimationComplete={() => {
        setFinishedGoal(true);
      }}
      style={{
        background: `${goalColor}`,
        boxShadow: `0px 0px 4px 0px ${goalColor}, 0px 0px 15px 0px ${goalColor}`,
      }}
      // style={{ top: Math.random() * 10 }}
    >
      <p className="goal-title">{goal.description}</p>
      <div className="bottom-part">
        <img src={urlHome + "/user/avatar/" + goal.avatarFileName} />
        <div className="reactions">
          {goal.reactions.map((reaction, index) => (
            <p key={index}>{reaction.type}</p>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function GoalPathContainer({
  goals,
  pathIndex,
}: {
  goals: Goal[];
  pathIndex: number;
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
          />
        ))}
    </div>
  );
}

function App() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isFullScreen, setIsFullScreen] = useState(false);

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
    });
  });

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
              <GoalPathContainer key={index} goals={path} pathIndex={index} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
