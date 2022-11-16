import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Modal } from "react-bootstrap";
import { FieldArray, Form, Formik } from "formik";
import DatePicker from "react-datepicker";
import { Portal } from "react-overlays";
import { TimePicker } from "antd";

import "antd/dist/antd.css";
import moment from "moment";
import "moment/locale/vi";

moment.locale("vi");

ModalCalendarLock.propTypes = {};

const CalendarContainer = ({ children }) => {
  const el = document.getElementById("calendar-portal");

  return <Portal container={el}>{children}</Portal>;
};

function ModalCalendarLock({
  show,
  onHide,
  onSubmit,
  ListLock,
  btnLoadingLock,
  AuthCrStockID,
}) {
  return (
    <Modal
      size="md"
      dialogClassName="modal-max-sm"
      show={show}
      onHide={onHide}
      scrollable={true}
    >
      <Formik
        initialValues={ListLock}
        //validationSchema={CalendarSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {(formikProps) => {
          const {
            errors,
            touched,
            values,
            handleChange,
            handleBlur,
            setFieldValue,
          } = formikProps;

          return (
            <Form className="h-100 d-flex flex-column">
              <Modal.Header className="open-close" closeButton>
                <Modal.Title className="text-uppercase">
                  Cài đặt khóa lịch
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <FieldArray
                  name="ListLocks"
                  render={(ListLocksHelpers) => (
                    <Fragment>
                      {values.ListLocks &&
                        values.ListLocks.map((lock, i) => (
                          <div
                            className={`${Number(AuthCrStockID) !==
                              Number(lock.StockID) && "d-none"}`}
                            key={i}
                          >
                            <FieldArray
                              name={`ListLocks[${i}].ListDisable`}
                              render={(ListDisableHelpers) => (
                                <div>
                                  {values.ListLocks[i].ListDisable &&
                                  values.ListLocks[i].ListDisable.length > 0 ? (
                                    values.ListLocks[i].ListDisable.map(
                                      (item, index) => (
                                        <div
                                          className={`${
                                            values.ListLocks[i].ListDisable
                                              .length -
                                              1 ===
                                            index
                                              ? ""
                                              : "mb-15px"
                                          }`}
                                          key={index}
                                        >
                                          <div className="d-flex">
                                            <DatePicker
                                              className="form-control font-size-sm"
                                              selected={
                                                item.Date
                                                  ? new Date(item.Date)
                                                  : ""
                                              }
                                              onChange={(date) => {
                                                setFieldValue(
                                                  `ListLocks[${i}].ListDisable[${index}.Date]`,
                                                  date
                                                );
                                              }}
                                              popperContainer={
                                                CalendarContainer
                                              }
                                              dateFormat="dd/MM/yyyy"
                                              placeholderText="Chọn ngày"
                                            />
                                            <button
                                              type="button"
                                              className="btn btn-light-success btn-sm ml-5px"
                                              onClick={() =>
                                                ListDisableHelpers.push({
                                                  Date: "",
                                                  TimeClose: [
                                                    {
                                                      Start: "",
                                                      End: "",
                                                    },
                                                  ],
                                                })
                                              }
                                            >
                                              <i className="fal fa-plus pr-0 font-size-xs"></i>
                                            </button>
                                            <button
                                              type="button"
                                              className="btn btn-light-danger btn-sm ml-5px"
                                              onClick={() =>
                                                ListDisableHelpers.remove(index)
                                              }
                                            >
                                              <i className="far fa-trash-alt pr-0 font-size-xs"></i>
                                            </button>
                                          </div>

                                          <FieldArray
                                            name={`ListLocks[${i}].ListDisable[${index}].TimeClose`}
                                            render={(TimeCloseHelpers) => (
                                              <div
                                                className={`listtime-lock ${(!item.TimeClose ||
                                                  item.TimeClose.length ===
                                                    0) &&
                                                  "d-none"}`}
                                              >
                                                {item.TimeClose &&
                                                  item.TimeClose.map(
                                                    (time, idx) => (
                                                      <div
                                                        className={`${
                                                          item.TimeClose
                                                            .length -
                                                            1 ===
                                                          idx
                                                            ? ""
                                                            : "mb-10px"
                                                        } listtime-lock__item`}
                                                        key={idx}
                                                      >
                                                        <div className="d-flex">
                                                          <TimePicker.RangePicker
                                                            onChange={(val) => {
                                                              setFieldValue(
                                                                `ListLocks[${i}].ListDisable[${index}].TimeClose[${idx}].Start`,
                                                                val &&
                                                                  moment(
                                                                    val[0]
                                                                  ).format(
                                                                    "HH:mm"
                                                                  )
                                                              );
                                                              setFieldValue(
                                                                `ListLocks[${i}].ListDisable[${index}].TimeClose[${idx}].End`,
                                                                val &&
                                                                  moment(
                                                                    val[1]
                                                                  ).format(
                                                                    "HH:mm"
                                                                  )
                                                              );
                                                            }}
                                                            format="HH:mm"
                                                            value={[
                                                              time.Start
                                                                ? moment(
                                                                    time.Start,
                                                                    "HH:mm"
                                                                  )
                                                                : "",
                                                              time.End
                                                                ? moment(
                                                                    time.End,
                                                                    "HH:mm"
                                                                  )
                                                                : "",
                                                            ]}
                                                            placeholder={[
                                                              "Bắt đầu",
                                                              "Kết thúc",
                                                            ]}
                                                            className="w-100"
                                                          />
                                                          <button
                                                            type="button"
                                                            className="btn btn-light-success btn-sm ml-5px"
                                                            onClick={() =>
                                                              TimeCloseHelpers.push(
                                                                idx,
                                                                {
                                                                  Start: "",
                                                                  End: "",
                                                                }
                                                              )
                                                            }
                                                          >
                                                            <i className="fal fa-plus pr-0 font-size-xs"></i>
                                                          </button>
                                                          <button
                                                            type="button"
                                                            className="btn btn-light-danger btn-sm ml-5px"
                                                            onClick={() =>
                                                              TimeCloseHelpers.remove(
                                                                idx
                                                              )
                                                            }
                                                          >
                                                            <i className="far fa-trash-alt pr-0 font-size-xs"></i>
                                                          </button>
                                                        </div>
                                                      </div>
                                                    )
                                                  )}
                                              </div>
                                            )}
                                          />
                                        </div>
                                      )
                                    )
                                  ) : (
                                    <div>
                                      Bạn chưa có lịch khóa trong từ hôm nay cho
                                      tới các ngày sắp tới. Vui lòng
                                      <span
                                        className="text-primary cursor-pointer font-weight-bold text-decoration-underline pl-5px"
                                        onClick={() =>
                                          ListDisableHelpers.push({
                                            Date: "",
                                            TimeClose: [
                                              {
                                                Start: "",
                                                End: "",
                                              },
                                            ],
                                          })
                                        }
                                      >
                                        Tạo khóa lịch mới
                                      </span>
                                    </div>
                                  )}
                                </div>
                              )}
                            />
                          </div>
                        ))}
                    </Fragment>
                  )}
                />
              </Modal.Body>
              <Modal.Footer>
                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  onClick={onHide}
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className={`btn btn-sm btn-primary ml-8px ${
                    btnLoadingLock ? "spinner spinner-white spinner-right" : ""
                  } w-auto my-0 mr-0 h-auto`}
                  disabled={btnLoadingLock}
                >
                  Cập nhập khóa lịch
                </button>
              </Modal.Footer>
            </Form>
          );
        }}
      </Formik>
    </Modal>
  );
}

export default ModalCalendarLock;
