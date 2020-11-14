import * as socket from "socket.io";

export function stockSocket(httpserver) {
  const io = new socket.Server(httpserver, {
    path: "/stock",
    // CROS
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    // either with send()
    socket.send("Hello!");

    // handle the event sent with socket.send()
    socket.on("message", (data) => {
      console.log(data);
    });

    // or with emit() and custom event names
    socket.emit("greetings", "Hey!", { ms: "jane" }, Buffer.from([4, 3, 3, 1]));

    // handle the event sent with socket.emit()
    socket.on("salutations", (elem1, elem2, elem3) => {
      console.log(elem1, elem2, elem3);
    });
  });

  return io;
}
