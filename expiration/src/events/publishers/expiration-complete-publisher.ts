import { Publisher, Subjects, ExpirationCompleteEvent } from '@devdezyn/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  // readonly prevents a property of a class from being changed.
  readonly subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
