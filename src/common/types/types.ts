export interface CustomConfigType {
  metadata: Metadata
  spec: Spec
}

export interface Metadata {
  name: string
  description: string
}

export interface Spec {
  steps: Step[]
  states?: any
}

export interface Step {
  fromState: string
  toState: string
  event: string
  autoTriggeringEvent?: string
  input?: Input
  actions: Action[]
  policy?: Policy
}

export interface Input {
  stage: string
  userBlock?: string
  allowedRole?: string
  onFailTriggerEvent?: string
  onPassTriggerEvent?: string
  sendValidateNotification?: boolean
  doNotSendAssignmentNotification?: boolean
}

export interface Action {
  type: string
  reference: string
  userBlock?: UserBlock
}

export interface UserBlock {
  reference: any
}

export interface Policy {
  eventTriggerPolicy?: EventTriggerPolicy
  confirmationPrompt?: ConfirmationPrompt
}

export interface EventTriggerPolicy {
  roles: string[]
}

export interface ConfirmationPrompt {
  label: string
}
