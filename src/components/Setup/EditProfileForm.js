import React from "react";
import { useState, useRef, useEffect } from "react";
import { connect } from "react-redux";
import history from "../../history";
import moment from "moment";
import { Link } from "react-router-dom";
import {
  Form,
  Input,
  Select,
  Button,
  Radio,
  DatePicker,
  Row,
  Col,
  Divider,
  Typography,
  Card,
  Space,
  Checkbox,
  Alert,
} from "antd";
import {
  ExperimentOutlined,
  SwapOutlined,
  DeleteOutlined,
  UserOutlined,
  PlusOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import ListOfJobs from "../Common/ListOfJobs";
import countryList from "../Common/countryList";
import { editUserProfile } from "../../firebase/users";
import { updateJobsStat } from "../../firebase/jobs";

const { Title } = Typography;
const { Option } = Select;

const validateMessages = {
  required: "required!",
  types: {
    email: "Please use a valid email",
    number: "not a valid number!",
  },
  number: {
    range: "out of range",
  },
};

const EditProfileForm = ({ auth, firstEdit, initialValues }) => {
  const formRef = useRef(null);
  const [formState, setFormState] = useState({ disabledEndDatePikers: {} });
  useEffect(() => {
    let disabledEndDatePikers = {};
    if (initialValues) {
      if (initialValues.experiences) {
        for (let iExp = 0; iExp < initialValues.experiences.length; iExp++) {
          disabledEndDatePikers[iExp] =
            initialValues.experiences[iExp].whenEndIspresent;
        }
      }

      let initialState = {
        disabledEndDatePikers: disabledEndDatePikers,
        changeFrom: initialValues.changeFrom ? initialValues.changeFrom : null,
        changeTo: initialValues.changeTo ? initialValues.changeTo : null,
        changeType: initialValues.changeType
          ? initialValues.changeType
          : "seeking",
        errorMessage: null,
      };

      setFormState(initialState);
    }
  }, [initialValues]);
  const handleOk = () => {
    formRef.current.submit();
  };
  const onFinish = (values) => {
    values.changeDate = values.changeDate.format();
    let experiences = values.experiences;
    if (experiences && experiences.length > 0) {
      experiences = experiences.map((exp, index) => {
        return {
          position: exp.position,
          at: exp.at ? exp.at : null,
          whenStart: exp.whenStart.format(),
          whenEnd: formState.disabledEndDatePikers[index]
            ? "present"
            : exp.whenEnd.format(),
        };
      });
      values.experiences = experiences;
    }

    //dates validation:
    if (moment(values.changeDate) > moment()) {
      setFormState((prevState) => {
        return {
          ...prevState,
          errorMessage: "The change date should not be in the future.",
        };
      });
      return;
    }
    if (experiences) {
      let message = null;
      for (let iExp = 0; iExp < experiences.length; iExp++) {
        if (moment(experiences[iExp].whenStart) > moment()) {
          message = `The starting date of your experience (${
            iExp + 1
          }) should not be in the future.`;
        } else if (experiences[iExp].whenEnd !== "present") {
          if (
            moment(experiences[iExp].whenStart) >
            moment(experiences[iExp].whenEnd)
          ) {
            message = `The starting date of your experience (${
              iExp + 1
            }) should not be after your end date`;
          }
        }
      }
      if (message) {
        setFormState((prevState) => {
          return {
            ...prevState,
            errorMessage: message,
          };
        });
        return;
      }
    }

    editUserProfile(values);
    updateJobsStat(values.changeFrom, values.changeTo, 1);
    history.push(firstEdit ? "/" : `/profile/${auth.user?.uid}`);
  };
  const onEndIsPresentChanged = (value, index) => {
    let disabledEndDatePikers = formState.disabledEndDatePikers;
    disabledEndDatePikers[index] = value;
    setFormState((prevState) => {
      return { ...prevState, disabledEndDatePikers };
    });
  };

  return (
    <Card
      className="custom-card continue-signup"
      actions={[
        <Link to={firstEdit ? "/" : `/profile/${auth.user?.uid}`}>
          <Space className="continue-signup-action continue-signup-skip">
            <CloseOutlined /> {firstEdit ? "Do it later" : "Cancel"}
          </Space>
        </Link>,
        <Space
          className="continue-signup-action continue-signup-save"
          onClick={handleOk}
        >
          <CheckOutlined /> Save
        </Space>,
      ]}
    >
      <Title level={3}>
        {firstEdit ? "Create your profile" : "Edit your profile"}
      </Title>
      <Form
        ref={formRef}
        size="large"
        name="about"
        onFinish={onFinish}
        validateMessages={validateMessages}
        initialValues={initialValues}
        onValuesChange={({ changeType, changeTo, changeFrom }) =>
          setFormState((prevState) => {
            return {
              ...prevState,
              changeType: changeType ? changeType : prevState.changeType,
              changeTo: changeTo ? changeTo : prevState.changeTo,
              changeFrom: changeFrom ? changeFrom : prevState.changeFrom,
              errorMessage: null,
            };
          })
        }
      >
        <Divider>
          <Space>
            <UserOutlined />
            Personal Information
          </Space>
        </Divider>
        <Row gutter={8} justify="center">
          <Col xs={24} lg={8}>
            <Form.Item
              name="firstName"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input
                addonBefore={<span className="required">First Name</span>}
                required
              />
            </Form.Item>
          </Col>
          <Col xs={24} lg={8}>
            <Form.Item
              name="lastName"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input
                addonBefore={<span className="required">Last Name</span>}
              />
            </Form.Item>
          </Col>
          <Col xs={24} lg={8}>
            <Form.Item name="country">
              <Select
                showSearch
                className="continue-signup-field"
                placeholder="Select a country"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {Object.keys(countryList).map((countryCode) => {
                  return (
                    <Option value={countryCode} key={countryCode}>
                      {countryList[countryCode]}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="bio">
              <Input.TextArea
                placeholder="tell us about yourself"
                autoSize={{ minRows: 4, maxRows: 7 }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Divider>
          <Space>
            <SwapOutlined />
            Career Change
          </Space>
        </Divider>
        <Row gutter={8} justify="center">
          <Col xs={24} lg={12}>
            <Form.Item
              name="changeType"
              rules={[
                {
                  required: true,
                  message: "Please pick an item!",
                },
              ]}
            >
              <Radio.Group size="large">
                <Radio value="seeking">Seeking a change</Radio>
                <Radio value="made">I made a change</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item
              name="changeDate"
              label={formState.changeType === "seeking" ? "since" : "on"}
              rules={[
                {
                  required: true,
                  message: "Please pick a change date!",
                },
              ]}
            >
              <DatePicker
                picker="month"
                placeholder="Select a date"
                className="continue-signup-field"
              />
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item
              name="changeFrom"
              label="from"
              rules={[
                {
                  required: true,
                  message: "Please pick an option!",
                },
              ]}
            >
              <Select
                showSearch
                className="continue-signup-field"
                placeholder="Select a job"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {Object.keys(ListOfJobs)
                  .sort((a, b) => ListOfJobs[a].localeCompare(ListOfJobs[b]))
                  .map((code) => {
                    return (
                      <Option
                        value={code}
                        key={code}
                        disabled={code === formState.changeTo}
                      >
                        {ListOfJobs[code]}
                      </Option>
                    );
                  })}
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} lg={12}>
            <Form.Item
              name="changeTo"
              label="to"
              rules={[
                {
                  required: true,
                  message: "Please pick an option!",
                },
              ]}
            >
              <Select
                showSearch
                className="continue-signup-field"
                placeholder="Select an job"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {Object.keys(ListOfJobs)
                  .sort((a, b) => ListOfJobs[a].localeCompare(ListOfJobs[b]))
                  .map((industryCode) => {
                    return (
                      <Option
                        value={industryCode}
                        key={industryCode}
                        disabled={industryCode === formState.changeFrom}
                      >
                        {ListOfJobs[industryCode]}
                      </Option>
                    );
                  })}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Divider>
          <Space>
            <ExperimentOutlined />
            Experience
          </Space>
        </Divider>
        <Form.List name="experiences">
          {(fields, { add, remove }) => (
            <>
              <Row justify="center" gutter={8}>
                {fields.map((field, index) => (
                  <Col
                    xs={24}
                    md={11}
                    lg={9}
                    key={index}
                    className="experince-form-set"
                  >
                    <Button
                      type="primary"
                      danger
                      size="small"
                      className="experince-form-set-delete"
                      onClick={() => remove(field.name)}
                    >
                      <DeleteOutlined />
                    </Button>
                    <Form.Item
                      {...field}
                      name={[field.name, "position"]}
                      key={`position_${index}`}
                      // fieldKey={[field.fieldKey, "position"]}
                      rules={[{ required: true, message: "Missing position" }]}
                    >
                      <Input placeholder="Position (e.g teacher)" />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, "at"]}
                      key={`at_${index}`}
                      // fieldKey={[field.fieldKey, "at"]}
                    >
                      <Input placeholder="At (e.g Ebba school)" />
                    </Form.Item>
                    <Space align="start">
                      <Form.Item
                        {...field}
                        name={[field.name, "whenStart"]}
                        fieldKey={[field.fieldKey, "whenStart"]}
                      >
                        <DatePicker
                          picker="month"
                          placeholder="from date"
                          className="continue-signup-field"
                        />
                      </Form.Item>
                      <Space direction="vertical" align="center">
                        <Form.Item
                          {...field}
                          name={[field.name, "whenEnd"]}
                          // fieldKey={[field.fieldKey, "whenEnd"]}
                          rules={[
                            {
                              required: !formState?.disabledEndDatePikers[
                                index
                              ],
                              message: "The end date is missing",
                            },
                          ]}
                        >
                          <DatePicker
                            picker="month"
                            placeholder="to date"
                            disabled={formState?.disabledEndDatePikers[index]}
                          />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          name={[field.name, "whenEndIspresent"]}
                          // fieldKey={[field.fieldKey, "whenEndIspresent"]}
                          valuePropName="checked"
                        >
                          <Checkbox
                            className="experince-form-set-checkbox"
                            onChange={(e) =>
                              onEndIsPresentChanged(e.target.checked, index)
                            }
                          >
                            present
                          </Checkbox>
                        </Form.Item>
                      </Space>
                    </Space>
                  </Col>
                ))}
              </Row>

              <Row justify="center">
                <Col>
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      // block
                      icon={<PlusOutlined />}
                    >
                      Add Experience
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </>
          )}
        </Form.List>
        {formState.errorMessage && (
          <Alert type="error" showIcon message={formState.errorMessage} />
        )}
      </Form>
    </Card>
  );
};

const mapStateToProps = (state) => {
  return { auth: state.auth };
};
export default connect(mapStateToProps)(EditProfileForm);
