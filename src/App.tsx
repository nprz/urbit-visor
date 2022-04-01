import { useState, useEffect } from "react";
import { urbitVisor } from "@dcspark/uv-core";
import type { Permission, Scry, Poke } from "@dcspark/uv-core";

interface Key {
  name: string; // the name of the channel, in kebab-case.
  ship: string; // the ship that hosts the channel
}

interface Thread {
  threadName: string; // name of the thread
  inputMark: string; // json to hoon conversion mark for the thread request body
  outputMark: string; // hoon to json conversion mark for the thread response body
  body: any; // request body
}

function App() {
  const [ship, setShip] = useState("");
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    urbitVisor.require(
      ["shipName", "scry", "subscribe", "poke", "thread"],
      setData
    );
  }, []);

  function setData() {
    urbitVisor.getShip().then((res) => setShip(res.response));
    checkChannelExists();
  }

  function checkChannelExists() {
    urbitVisor
      .scry({
        app: "graph-store",
        path: "/keys",
      })
      .then((res) => {
        const keys: Key[] = res.response["graph-update"].keys;
        if (
          keys.find(
            (key: Key) => key.ship === ship && key.name === "my-urbit-notes"
          )
        ) {
          setRegistered(true);
        } else {
          createChannel();
        }
      });
  }

  async function createChannel() {
    const body = {
      create: {
        resource: {
          ship: `~${ship}`,
          name: "my-urbit-notes",
        },
        title: "My Urbit Notes",
        description: "My Private Urbit Notebook",
        associated: {
          policy: {
            invite: { pending: [] },
          },
        },
        module: "publish",
        mark: "graph-validator-publish",
      },
    };

    urbitVisor
      .thread({
        threadName: "graph-create",
        inputMark: "graph-view-action",
        outputMark: "json",
        body,
      })
      .then((res) => {
        if (res.status === "ok") {
          checkChannelExists();
        }
      });
  }

  return (
    <div>
      {ship && <div>~{ship}</div>}
      <div>urbit</div>
    </div>
  );
}

export default App;
