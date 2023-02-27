import { SyncOutlined, LoadingOutlined } from "@ant-design/icons";

function Header({ subtitle, isRunning }) {
  const headerStyle = {
    display: "flex",
    justifyContent: "left",
    alignItems: "center",
    padding: ".5em 1em",
    marginBottom: ".5em",
    backgroundColor: "var(--green)",
    color: "black",
  };

  const paddingZero = {
    padding: "0",
  };

  const mLeft1 = {
    margin: "0 0 0 1em",
  };

  return (
    <header style={headerStyle}>
      <h1
        style={{
          fontWeight: "Bold",
          textAlign: "left",
          fontSize: "1.5em",
          ...mLeft1,
          ...paddingZero,
        }}
      >
        Simbot (replit public version)
      </h1>
      <h2 style={{ ...mLeft1, ...paddingZero, fontSize: "1.1em" }}>
        {subtitle}
      </h2>
      {isRunning ? (
        <LoadingOutlined
          spin
          style={{
            color: "white",
            fontSize: "1.5em",
            ...mLeft1,
            ...paddingZero,
          }}
        />
      ) : null}
    </header>
  );
}

export default Header;
