import { TypedEvent } from "./typedEvent";

export const GameEventBus = {
  charPicked: new TypedEvent<number>(),
  wordFound: new TypedEvent<void>(),
  wordFailed: new TypedEvent<void>(),
};
