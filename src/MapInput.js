import { Statistic, Row, Col, Button, Progress, Input, Card } from "antd";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
// import brickwall from './brickwall.svg';
import "antd/dist/antd.css";

const { TextArea } = Input;

function MapInput({ socket, setSubtitle }) {
  const [isMapValid, setIsMapValid] = useState(false);
  const [input, setInput] = useState("");
  const [mapInput, setMapInput] = useState(``);

  const history = useHistory();

  const mapInputHandle = (e) => {
    setMapInput(e.target.value);
    setIsMapValid(false);
  };

  // Trims the map input and replace any charachter that is not '#' ' ' with '#'
  const ValidateMap = () => {
    let inputValue = mapInput;

    inputValue = inputValue.trim().replace(/\w/gm, "#");
    setMapInput(inputValue);
    setIsMapValid(true);
  };

// Emit the new map to the server
  const emitNewMap = () => {
    socket.emit("loadmap", mapInput);
    history.push("/app");
  };

  // Defaultmap option
  const defaultMap = () => {
    setMapInput(
      `####################
#             ## # #
# # ## #####   # # #
# # ## #####  ## # #
# #            #   #
# # ########  #### #
# #              # #
# # ########  ## # #
#                # #
# # ########  ## # #
# #              # #
# # ########  ## # #
#                  #
####################`
    );

    setIsMapValid(true);
  };

  useEffect(() => {
    setSubtitle("Map Input");
  }, []);

  return (
    <div
      className="Map-Input"
      style={{
        maxWidth: 800,
        margin: "1em auto",
        textAlign: "center",
      }}
    >
      <Card
        size="small"
        title={
          <h3>
            <strong>Map Instructions</strong>
          </h3>
        }
        style={{ textAlign: "left" }}
        extra={<Button onClick={defaultMap}>Default Map</Button>}
      >
        <ul>
          <li>
            Insert below a long ASCII character string:
            <ul>
              <li>“ “ - empty spaces where robot can drive through</li>
              <li>“#” - walls</li>
              <li>“\n” - a new line of the map</li>
            </ul>
          </li>
          <li>every space is reachable</li>
          <li>
            the height and width of the maze can vary, but is always be a
            rectangle
          </li>
        </ul>
      </Card>

      <TextArea
        rows={16}
        onChange={mapInputHandle}
        value={mapInput}
        style={{
          fontSize: ".8em",
          fontFamily: "monospace",
          fontWeight: "Black",
          margin: "1em auto",
        }}
      />

      {isMapValid ? (
        <Button type="primary" onClick={emitNewMap}>
          Use Map
        </Button>
      ) : (
        <Button onClick={ValidateMap}>Validate Map</Button>
      )}
    </div>
  );
}

export default MapInput;
