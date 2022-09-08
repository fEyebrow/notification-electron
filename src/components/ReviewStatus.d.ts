export interface ReviewPayload {
  status: StatusType,
  examine_operate: {
    from_status: StatusType, to_status: StatusType
  }
}