import {
  Statistic,
  Row,
  Col,
  Button,
  Progress,
  Input,
  Modal,
  Card,
} from "antd";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import "./App.css";
import "antd/dist/antd.css";

const { TextArea } = Input;

function App({ socket, setSubtitle, setIsRunning }) {

  const history = useHistory();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFinished, setIsfinished] = useState(false);

  const [input, setInput] = useState("");
  const [mapInput, setMapInput] = useState(``);

  // Starts the botData with some initial values to avoid errors
  const [botData, setBotData] = useState({
    currentPosition: [],
    currentMap: [
      [0, 1, 1, 0],
      [2, 2, 3, 4],
    ],
    totalCleanedTiles: 0,
    totalWalkTiles: 1,
    mapWidth: 1,
    mapHeight: 1,
    startedTime: 0,
    elapsedTime: 0,
    finishedTime: 0,
    totalSteps: 0,
  });

  // console.log(input);

  socket.on("update", (data) => {
    setBotData(data);
  });

  socket.on("finished", (data) => {
    if (!isFinished) {
      setIsfinished(data);
    }
  });

  useEffect(() => {
    if (isFinished) {
      setBotData({ ...botData, totalCleanedTiles: botData.totalWalkTiles });
      Modal.success({
        title: "Cleaning Task Finished",
        content: `      
      It took ${botData.elapsedTime.toFixed(
        2
      )} seconds to clean the whole floor.`,
      });
    }
  }, [isFinished]);

  useEffect(() => {
    setSubtitle("Cleaning Task Monitor");
  }, []);

  const emitEvent = () => {
    socket.emit("command", input);
  };

  const emitPause = () => {
    socket.emit("command", "pause");
    setIsRunning(false);
  };

  const emitResume = () => {
    socket.emit("command", "resume");
    setIsRunning(true);
  };

  const emitStop = () => {
    socket.emit("command", "stop");
    setIsfinished(false);
    setIsRunning(false);
    history.push("/");
  };

  const stopResetBtn = () => (
    <Button onClick={emitStop} type="primary" danger>
      {(function () {
        if (!isFinished) {
          return "Stop";
        }
        setIsRunning(false);
        return "Reset";
      })()}
    </Button>
  );

  return (
    <div className="App">
      <div className="map-container">
        <div
          id="tilemap"
          style={{ gridTemplateColumns: `repeat(${botData.mapWidth}, auto` }}
        >
          {botData.currentMap.map((line) => {
            return line.map((tile) => {
              return <span className={`tile vl-${tile}`}></span>;
            });
          })}
        </div>
        <div
          id="bot"
          style={{
            left: `${(botData.currentPosition[1] * 100) / botData.mapWidth}%`,
            top: `${(botData.currentPosition[0] * 100) / botData.mapHeight}%`,
          }}
        ></div>
      </div>
      <Card
        title={<h2 style={{ fontSize: "1.2em" }}>Task Info and Data</h2>}
        style={{ maxWidth: "800px", margin: "1em auto" }}
        extra={stopResetBtn()}
      >
        <Row gutter={16}>
          <Col span={8}>
            <Statistic title="Total Areas" value={botData.totalWalkTiles} />
            <Statistic
              title="Total Cleaned Areas"
              value={botData.totalCleanedTiles}
              suffix=""
              style={{ margin: ".5em 0" }}
            />
            <Statistic
              title="Elapsed Time"
              value={botData.elapsedTime.toFixed(2)}
              suffix=" s"
              style={{ margin: ".5em 0" }}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Productivity "
              value={
                Math.round(botData.totalCleanedTiles / botData.elapsedTime) || 0
              }
              suffix=" Areas/s"
              style={{ margin: ".5em 0" }}
            />
            <Statistic
              title="Total Steps"
              value={botData.totalSteps}
              suffix=" Areas"
              style={{ margin: ".5em 0" }}
            />
            <Statistic
              title="Non Cleaning Steps"
              value={botData.totalSteps - botData.totalCleanedTiles}
              suffix=" Areas"
              style={{ margin: ".5em 0" }}
            />
          </Col>

          <Col span={8}>
            <p>Cleaned Areas %:</p>

            <Progress
              type="circle"
              width={80}
              percent={Math.round(
                (botData.totalCleanedTiles * 100) / botData.totalWalkTiles
              )}
            />
            <Statistic
              title="Position"
              value={`( ${botData.currentPosition[0]} , ${botData.currentPosition[1]} )`}
              style={{ margin: "1em 0" }}
            />
          </Col>
        </Row>
      </Card>
      ,
      {(function () {
        if (!isFinished) {
          return botData.isPaused ? (
            <Button type="primary" onClick={emitResume}>
              Resume
            </Button>
          ) : (
            <Button onClick={emitPause}>Pause</Button>
          );
        }
      })()}
    </div>
  );
}

export default App;
