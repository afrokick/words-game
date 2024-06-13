import type { UIStates } from "./store";
import { TypedEvent } from "./typedEvent";

export const GameEventBus = {
  charPicked: new TypedEvent<number>(),
  wordFound: new TypedEvent<void>(),
  wordFailed: new TypedEvent<void>(),
  wordExisted: new TypedEvent<void>(),
  uiStateChanged: new TypedEvent<UIStates>(),
  sessionExpired: new TypedEvent<void>(),
  sessionUpdated: new TypedEvent<void>(),
  tabVisibilityChanged: new TypedEvent<boolean>(),
};
