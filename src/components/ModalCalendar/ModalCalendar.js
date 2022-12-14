import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
import Select, { components } from "react-select";
import AsyncCreatableSelect from 'react-select/async-creatable';
import AsyncSelect from "react-select/async";
import { Dropdown, Modal } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import moment from "moment";
import CalendarCrud from "../../App/modules/Calendar/_redux/CalendarCrud";
import { toUrlServer } from "../../helpers/AssetsHelpers";
import ModalCreateMember from "../ModalCreateMember/ModalCreateMember";
moment.locale("vi");

ModalCalendar.propTypes = {
  show: PropTypes.bool,
  onHide: PropTypes.func,
  onSubmit: PropTypes.func,
};
ModalCalendar.defaultProps = {
  show: false,
  onHide: null,
  onSubmit: null,
};

const CustomOptionStaff = ({ children, ...props }) => {
  const { Thumbnail, label } = props.data;
  return (
    <components.Option {...props}>
      <div className="d-flex align-items-center">
        {
          Thumbnail && (
            <div className="w-20px h-20px mr-3 rounded-circle overflow-hidden d-flex align-items-center justify-content-center">
              <img className="w-100" src={Thumbnail} alt={label} />
            </div>
          )
        }

        {children}
      </div>
    </components.Option>
  );
};

const initialDefault = {
  MemberID: null,
  RootIdS: "",
  BookDate: new Date(),
  Desc: "",
  StockID: 0,
  UserServiceIDs: "",
  AtHome: false,
};

function ModalCalendar({
  show,
  onHide,
  onSubmit,
  onFinish,
  btnLoading,
  initialValue,
  onDelete,
}) {
  const [initialValues, setInitialValues] = useState(initialDefault);
  const { AuthStocks, AuthCrStockID } = useSelector(({ Auth }) => ({
    AuthStocks: Auth.Stocks.filter(
      (item) => item.ParentID !== 0
    ).map((item) => ({ ...item, value: item.ID, label: item.Title })),
    AuthCrStockID: Auth.CrStockID,
  }));
  const [isModalCreate, setIsModalCreate] = useState(false)
  const [initialCreate, setInitialCreate] = useState({
    FullName: "",
    Phone: "",
    PassersBy: false, // Kh??ch v??ng lai
  })

  useEffect(() => {
    if (show) {
      if (initialValue.ID) {
        setInitialValues((prevState) => ({
          ...prevState,
          ID: initialValue.ID,
          MemberID: {
            label: initialValue.Member.FullName,
            text: initialValue.FullName || initialValue.Member.FullName,
            value: initialValue.Member.ID,
            suffix: initialValue.Phone || initialValue.Member.MobilePhone,
          },
          RootIdS: initialValue.Roots.map((item) => ({
            ...item,
            value: item.ID,
            label: item.Title,
          })),
          Status: initialValue.Status,
          BookDate: initialValue.BookDate,
          StockID: initialValue.StockID,
          Desc: initialValue.Desc,
          UserServiceIDs: initialValue.UserServices.map((item) => ({
            ...item,
            value: item.ID,
            label: item.FullName,
          })),
          AtHome: initialValue.AtHome,
          IsMemberCurrent: getIsMember(initialValue),
        }));
      } else {
        setInitialValues((prevState) => ({
          ...prevState,
          StockID: AuthCrStockID,
          BookDate: initialValue?.BookDate ? initialValue.BookDate : new Date(),
          UserServiceIDs: initialValue?.UserServiceIDs || []
        }));
      }
    } else {
      setInitialValues(initialDefault);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, initialValue]);

  const getIsMember = (member) => {
    const objMember = {
      IsAnonymous: false,
    };
    if (member?.Member?.MobilePhone === "0000000000") {
      objMember.IsAnonymous = true;
      objMember.MemberCreate = {
        FullName: member?.FullName,
        Phone: member?.Phone,
      };
      objMember.MemberPhone = member?.MemberPhone;
    }
    else {
      objMember.MemberID = member?.Member?.ID;
    }
    return objMember;
  }

  const loadOptionsCustomer = (inputValue, callback) => {
    setTimeout(async () => {
      const { data } = await CalendarCrud.getMembers(inputValue);
      const dataResult = data.data.map((item) => ({
        ...item,
        value: item.id,
        label: item.text,
        Thumbnail: toUrlServer("/images/user.png"),
      }));
      callback(dataResult);
    }, 300);
  };

  const loadOptionsStaff = (inputValue, callback, stockID) => {
    const filters = {
      key: inputValue,
      StockID: stockID,
      Type: "DV"
    };
    setTimeout(async () => {
      const { data } = await CalendarCrud.getStaffs(filters);
      const dataResult = data.data.map((item) => ({
        value: item.id,
        label: item.text,
        Thumbnail: toUrlServer("/images/user.png"),
      }));
      callback(dataResult);
    }, 300);
  };

  const loadOptionsServices = (inputValue, callback, stockID, MemberID) => {
    const filters = {
      Key: inputValue,
      StockID: stockID,
      MemberID: MemberID?.value,
    };
    setTimeout(async () => {
      const { data } = await CalendarCrud.getRootServices(filters);
      const dataResult = data.lst.map((item) => ({
        value: item.ID,
        label: item.Title,
      }));
      callback(dataResult);
    }, 300);
  };

  const getTitleModal = (Status, formikProps) => {
    const { setFieldValue } = formikProps;
    if (!Status) {
      return "?????t l???ch d???ch v???";
    }
    if (Status === "CHUA_XAC_NHAN") {
      return <span className="text-warning">Ch??a x??c nh???n</span>;
    }
    return (
      <Dropdown>
        <Dropdown.Toggle
          className={`bg-transparent p-0 border-0 modal-dropdown-title ${Status === "XAC_NHAN" ? "text-primary" : ""
            } ${Status === "KHACH_KHONG_DEN" ? "text-danger" : ""} ${Status === "KHACH_DEN" ? "text-success" : ""
            }`}
          id="dropdown-custom-1"
        >
          <span>
            {Status === "XAC_NHAN" ? "???? x??c nh???n" : ""}
            {Status === "KHACH_KHONG_DEN" ? "Kh??ch h??ng kh??ng ?????n" : ""}
            {Status === "KHACH_DEN" ? "Ho??n th??nh" : ""}
          </span>
        </Dropdown.Toggle>
        <Dropdown.Menu className="super-colors">
          <Dropdown.Item
            className="font-weight-bold"
            eventKey="1"
            active={Status === "XAC_NHAN"}
            onClick={() => setFieldValue("Status", "XAC_NHAN", false)}
          >
            ???? x??c nh???n
          </Dropdown.Item>
          <Dropdown.Item
            className="font-weight-bold"
            eventKey="2"
            active={Status === "KHACH_KHONG_DEN"}
            onClick={() => setFieldValue("Status", "KHACH_KHONG_DEN", false)}
          >
            ?????t nh??ng kh??ng ?????n
          </Dropdown.Item>
          <Dropdown.Item
            className="font-weight-bold"
            eventKey="3"
            active={Status === "KHACH_DEN"}
            onClick={() => setFieldValue("Status", "KHACH_DEN", false)}
          >
            Ho??n th??nh
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  };

  const renderFooterModal = (Status, formikProps) => {
    const { submitForm, setFieldValue, values } = formikProps;
    if (!Status) {
      return (
        <Fragment>
          <button
            type="submit"
            className={`btn btn-sm btn-primary mr-2 ${btnLoading.isBtnBooking
              ? "spinner spinner-white spinner-right"
              : ""
              } w-auto my-0 mr-0 h-auto`}
            disabled={btnLoading.isBtnBooking}
          >
            ?????t l???ch
          </button>
        </Fragment>
      );
    }
    if (Status === "CHUA_XAC_NHAN") {
      return (
        <Fragment>
          <button
            type="submit"
            className={`btn btn-sm btn-primary mr-2 ${btnLoading.isBtnBooking
              ? "spinner spinner-white spinner-right"
              : ""
              } w-auto my-0 mr-0 h-auto`}
            disabled={btnLoading.isBtnBooking}
            onClick={() => {
              setFieldValue("Status", "XAC_NHAN", submitForm()); //submitForm()
            }}
          >
            X??c nh???n
          </button>
        </Fragment>
      );
    }
    return (
      <Fragment>
        <button
          type="submit"
          className={`btn btn-sm btn-primary mr-2 ${btnLoading.isBtnBooking ? "spinner spinner-white spinner-right" : ""
            } w-auto my-0 mr-0 h-auto`}
          disabled={btnLoading.isBtnBooking}
        >
          L??u
        </button>
        <button
          type="button"
          className={`btn btn-sm btn-primary mr-2 ${btnLoading.isBtnBooking
            ? "spinner spinner-white spinner-right"
            : ""
            } w-auto my-0 mr-0 h-auto`}
          disabled={btnLoading.isBtnBooking}
          onClick={() => onFinish(values)}
        >
          Th???c hi???n
        </button>
      </Fragment>
    );
  };

  const CalendarSchema = Yup.object().shape({
    BookDate: Yup.string().required("Vui l??ng ch???n ng??y ?????t l???ch."),
    MemberID: Yup.object()
      .nullable()
      .required("Vui l??ng ch???n kh??ch h??ng"),
    RootIdS: Yup.array()
      .required("Vui l??ng ch???n d???ch v???.")
      .nullable(),
    // UserServiceIDs: Yup.array()
    //   .required("Vui l??ng ch???n nh??n vi??n.")
    //   .nullable(),
    StockID: Yup.string().required("Vui l??ng ch???n c?? s???."),
  });

  return (
    <Fragment>
      <Modal
        size="md"
        dialogClassName="modal-max-sm modal-content-right"
        show={show}
        onHide={onHide}
        scrollable={true}
      >
        <Formik
          initialValues={initialValues}
          validationSchema={CalendarSchema}
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
                    {getTitleModal(values.Status, formikProps)}
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-0">
                  <div className="form-group form-group-ezs px-6 pt-3 mb-3">
                    <label className="mb-1 d-none d-md-block">Kh??ch h??ng</label>
                    <AsyncCreatableSelect
                      className={`select-control ${
                        errors.MemberID && touched.MemberID
                          ? "is-invalid solid-invalid"
                          : ""
                      }`}
                      classNamePrefix="select"
                      isLoading={false}
                      isDisabled={false}
                      isClearable
                      isSearchable
                      //menuIsOpen={true}
                      name="MemberID"
                      value={values.MemberID}
                      onChange={(option) => {
                        setFieldValue("MemberID", option);
                      }}
                      onBlur={handleBlur}
                      placeholder="Ch???n kh??ch h??ng"
                      components={{
                        Option: CustomOptionStaff,
                      }}
                      onCreateOption={(inputValue) => {
                        const initValue = { ...initialCreate };
                        if (/^-?\d+$/.test(inputValue)) {
                          initValue.Phone = inputValue;
                          initValue.FullName = "";
                        } else {
                          initValue.Phone = "";
                          initValue.FullName = inputValue;
                        }
                        setInitialCreate(initValue);
                        setIsModalCreate(true);
                      }}
                      formatCreateLabel={(inputValue) => (
                        <span className="text-primary">
                          T???o m???i "{inputValue}"
                        </span>
                      )}
                      menuPosition="fixed"
                      cacheOptions
                      loadOptions={loadOptionsCustomer}
                      defaultOptions
                      noOptionsMessage={({ inputValue }) =>
                        !inputValue
                          ? "Kh??ng c?? kh??ch h??ng"
                          : "Kh??ng t??m th???y kh??ch h??ng"
                      }
                      //isValidNewOption={(inputValue, selectValue, selectOptions) => inputValue && selectOptions.length === 0}
                    />
                    {values.MemberID && (
                      <div className="d-flex mt-2 font-size-xs">
                        <div className="mr-4">
                          Kh??ch h??ng :
                          <span className="font-weight-bold pl-1">
                            {values.MemberID?.text}
                          </span>
                        </div>
                        <div>
                          S??? ??i???n tho???i :
                          <span className="font-weight-bold pl-1">
                            {values.MemberID?.suffix}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="form-group form-group-ezs px-6 pt-3 mb-3 border-top">
                    <label className="mb-1 d-none d-md-flex justify-content-between">
                      Th???i gian / C?? s???
                      {/* <span className="btn btn-label btn-light-primary label-inline cursor-pointer">
                      L???p l???i
                    </span> */}
                    </label>
                    <DatePicker
                      name="BookDate"
                      selected={
                        values.BookDate ? new Date(values.BookDate) : ""
                      }
                      onChange={(date) => setFieldValue("BookDate", date)}
                      onBlur={handleBlur}
                      className={`form-control ${
                        errors.BookDate && touched.BookDate
                          ? "is-invalid solid-invalid"
                          : ""
                      }`}
                      shouldCloseOnSelect={false}
                      dateFormat="dd/MM/yyyy HH:mm"
                      placeholderText="Ch???n th???i gian"
                      timeInputLabel="Th???i gian"
                      showTimeSelect
                      timeFormat="HH:mm"
                    />
                    <Select
                      className={`select-control mt-2 ${
                        errors.StockID && touched.StockID
                          ? "is-invalid solid-invalid"
                          : ""
                      }`}
                      classNamePrefix="select"
                      value={AuthStocks.filter(
                        (item) => item.ID === values.StockID
                      )}
                      //isLoading={true}
                      //isDisabled={true}
                      isClearable
                      isSearchable
                      //menuIsOpen={true}
                      name="StockID"
                      placeholder="Ch???n c?? s???"
                      options={AuthStocks}
                      onChange={(option) => {
                        setFieldValue("StockID", option ? option.value : "");
                      }}
                      menuPosition="fixed"
                      onBlur={handleBlur}
                    />
                  </div>
                  <div className="form-group form-group-ezs border-top px-6 pt-3 mb-3">
                    <label className="mb-1 d-none d-md-block">D???ch v???</label>
                    <AsyncSelect
                      key={`${
                        values.MemberID && values.MemberID.value
                          ? values.MemberID.value
                          : "No-Member"
                      }-${values.StockID}`}
                      menuPosition="fixed"
                      isMulti
                      className={`select-control ${
                        errors.RootIdS && touched.RootIdS
                          ? "is-invalid solid-invalid"
                          : ""
                      }`}
                      classNamePrefix="select"
                      isLoading={false}
                      isDisabled={false}
                      isClearable
                      isSearchable
                      //menuIsOpen={true}
                      value={values.RootIdS}
                      onChange={(option) => setFieldValue("RootIdS", option)}
                      name="RootIdS"
                      placeholder="Ch???n d???ch v???"
                      cacheOptions
                      loadOptions={(v, callback) =>
                        loadOptionsServices(
                          v,
                          callback,
                          values.StockID,
                          values.MemberID
                        )
                      }
                      defaultOptions
                      noOptionsMessage={({ inputValue }) =>
                        !inputValue
                          ? "Kh??ng c?? d???ch v???"
                          : "Kh??ng t??m th???y d???ch v???"
                      }
                    />

                    <div className="d-flex align-items-center justify-content-between mt-3">
                      <label className="mr-3">S??? d???ng d???ch v??? t???i nh??</label>
                      <span className="switch switch-sm switch-icon">
                        <label>
                          <input
                            type="checkbox"
                            name="AtHome"
                            onChange={(evt) =>
                              setFieldValue("AtHome", evt.target.checked)
                            }
                            onBlur={handleBlur}
                            checked={values.AtHome}
                          />
                          <span />
                        </label>
                      </span>
                    </div>
                  </div>
                  <div className="form-group form-group-ezs px-6 pt-3 mb-3 border-top">
                    <label className="mb-1 d-none d-md-block">
                      Nh??n vi??n th???c hi???n
                    </label>
                    <AsyncSelect
                      key={values.StockID}
                      className={`select-control ${
                        errors.UserServiceIDs && touched.UserServiceIDs
                          ? "is-invalid solid-invalid"
                          : ""
                      }`}
                      classNamePrefix="select"
                      isLoading={false}
                      isDisabled={false}
                      isClearable
                      isSearchable
                      isMulti
                      menuPosition="fixed"
                      //menuIsOpen={true}
                      name="UserServiceIDs"
                      value={values.UserServiceIDs}
                      onChange={(option) =>
                        setFieldValue("UserServiceIDs", option)
                      }
                      placeholder="Ch???n nh??n vi??n"
                      components={{
                        Option: CustomOptionStaff,
                      }}
                      cacheOptions
                      loadOptions={(v, callback) =>
                        loadOptionsStaff(v, callback, values.StockID)
                      }
                      defaultOptions
                      noOptionsMessage={({ inputValue }) =>
                        !inputValue
                          ? "Kh??ng c?? nh??n vi??n"
                          : "Kh??ng t??m th???y nh??n vi??n"
                      }
                    />
                    <textarea
                      name="Desc"
                      value={values.Desc}
                      className="form-control mt-2"
                      rows="2"
                      placeholder="Nh???p ghi ch??"
                      onChange={handleChange}
                      onBlur={handleBlur}
                    ></textarea>
                  </div>
                </Modal.Body>
                <Modal.Footer className="justify-content-between">
                  <div>
                    {renderFooterModal(initialValues.Status, formikProps)}
                    {values.ID && (
                      <button
                        type="button"
                        className={`btn btn-sm btn-danger mr-2 ${
                          btnLoading.isBtnDelete
                            ? "spinner spinner-white spinner-right"
                            : ""
                        } w-auto my-0 mr-0 h-auto`}
                        disabled={btnLoading.isBtnDelete}
                        onClick={() => onDelete(values)}
                      >
                        H???y l???ch
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn btn-sm btn-secondary d-md-none"
                      onClick={onHide}
                    >
                      ????ng
                    </button>
                  </div>
                  <div></div>
                </Modal.Footer>
                <ModalCreateMember
                  show={isModalCreate}
                  onHide={() => setIsModalCreate(false)}
                  initialDefault={initialCreate}
                  onSubmit={(valuesCreate) => {
                    setFieldValue("MemberID", {
                      label: valuesCreate.PassersBy
                        ? "Kh??ch v??ng lai"
                        : valuesCreate.FullName,
                      text: valuesCreate.FullName,
                      value: valuesCreate.PassersBy ? 0 : null,
                      suffix: valuesCreate.Phone,
                      isCreate: true,
                      PassersBy: valuesCreate.PassersBy,
                    });
                    setIsModalCreate(false);
                  }}
                />
              </Form>
            );
          }}
        </Formik>
      </Modal>
    </Fragment>
  );
}

export default ModalCalendar;
