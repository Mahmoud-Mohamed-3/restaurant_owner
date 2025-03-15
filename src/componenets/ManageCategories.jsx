import {useEffect, useState} from "react";
import {useCookies} from "react-cookie";
import {GetCategoriesApi} from "../API calls/Dashboard/Categories/GetCategories.jsx";
import {Table, Button, Modal, Form, Input, notification, Upload, InputNumber} from "antd";
import {EditOutlined, DeleteOutlined, PlusOutlined, UploadOutlined} from "@ant-design/icons";
import "../css/manage_categories.css";
import {GetCategoryApi} from "../API calls/Dashboard/Categories/GetCategory.jsx";
import {UpdateCategoryApi} from "../API calls/Dashboard/Categories/UpdateCategory.jsx";
import {GetCategoryChefApi} from "../API calls/Dashboard/Categories/Chefs/GetCategoryChef.jsx";
import {UpdateChefApi} from "../API calls/Dashboard/Categories/Chefs/UpdateChef.jsx";
import {NewCategoryApi} from "../API calls/Dashboard/Categories/NewCategory.js";
import {AddNewChefApi} from "../API calls/Dashboard/Categories/Chefs/AddNewChef.jsx";
import {DeleteCategoryApi} from "../API calls/Dashboard/Categories/DeleteCategory.jsx";

export default function ManageCategories() {
  useEffect(() => {
    document.title = "Manage Categories";
  }, []);

  const [cookies] = useCookies();
  const [categories, setCategories] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [addCategoryModalVisible, setAddCategoryModalVisible] = useState(false);
  const [editChefModalVisible, setEditChefModalVisible] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [selectedCategoryID, setSelectedCategoryID] = useState(null);
  const [form] = Form.useForm();
  const [categoryChef, setCategoryChef] = useState(null);
  const [categoryFileList, setCategoryFileList] = useState([]);
  const [chefFileList, setChefFileList] = useState([]);
  const [categoryImageUrl, setCategoryImageUrl] = useState(null);
  const [chefImageUrl, setChefImageUrl] = useState(null);
  const [chefDetails, setChefDetails] = useState(null);
  const [categoryChefId, setCategoryChefId] = useState(null);

  const fetchCategories = async () => {
    const response = await GetCategoriesApi(cookies.jwt);
    if (response) {
      setCategories(response.data);
    } else {
      console.error("Error fetching categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [cookies]);

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      if (selectedCategoryID) {
        const response = await GetCategoryApi(cookies.jwt, selectedCategoryID);
        if (response) {
          setCurrentCategory(response.data);
          setChefDetails(response.data.chef); // Set chef details when category is fetched
        } else {
          console.error("Error fetching category details");
        }
      }
    };
    fetchCategoryDetails();
  }, [selectedCategoryID, cookies.jwt]);

  useEffect(() => {
    const fetchChefDetails = async () => {
      if (categoryChefId) {
        const response = await GetCategoryChefApi(cookies.jwt, categoryChefId);
        if (response) {
          setCategoryChef(response.data);
        } else {
          console.error("Error fetching category chef details");
        }

      }
    };
    fetchChefDetails();
  }, [categoryChefId, cookies.jwt]);
  // console.log(categoryChef);

  // useEffect(() => {
  //   if (categoryChef) {
  //     setChefDetails(categoryChef);
  //   }
  // }, []);
  useEffect(() => {
    if (categoryChef) {
      form.setFieldsValue({
        first_name: categoryChef.first_name,
        last_name: categoryChef.last_name,
        email: categoryChef.email,
        phone_number: categoryChef.phone_number,
        age: categoryChef.age,
        salary: categoryChef.salary,
        profile_image: categoryChef.profile_image_url,
      });
      setChefImageUrl(categoryChef.profile_image_url);
    }
  }, [categoryChef, form]);

  useEffect(() => {
    if (currentCategory) {
      form.setFieldsValue({
        title: currentCategory.title,
        description: currentCategory.description,
        image: currentCategory.image_url,
      });
      setCategoryImageUrl(currentCategory.image_url);
    }
  }, [currentCategory, form]);

  const handleCategoryFileChange = ({fileList: newFileList}) => {
    setCategoryFileList(newFileList);
    if (newFileList.length > 0) {
      const newImageUrl = URL.createObjectURL(newFileList[0].originFileObj);
      setCategoryImageUrl(newImageUrl);
    } else {
      setCategoryImageUrl(null);
    }
  };

  const handleChefFileChange = ({fileList: newFileList}) => {
    setChefFileList(newFileList);
    if (newFileList.length > 0) {
      const newImageUrl = URL.createObjectURL(newFileList[0].originFileObj);
      setChefImageUrl(newImageUrl);
    } else {
      setChefImageUrl(null);
    }
  };

  const beforeUpload = (file) => {
    const isImage = file.type === "image/jpeg" || file.type === "image/png";
    const isLt3M = file.size / 1024 / 1024 < 3;
    if (!isImage) {
      notification.error("You can only upload JPG/PNG files!");
    }
    if (!isLt3M) {
      notification.error("File must be smaller than 3MB!");
    }
    return isImage && isLt3M;
  };

  const handleEditCategory = (id) => {
    setSelectedCategoryID(id);
    setModalVisible(true);
  };

  const handleRemoveCategory = async (categoryId) => {
    const response = await DeleteCategoryApi(cookies.jwt, categoryId);
    if (response) {
      notification.success({message: "Category removed successfully!"});
    } else {
      notification.error({message: "Error removing category!"});
    }

    fetchCategories();
  };

  const handleSaveCategoryChanges = async (values) => {
    const formData = new FormData();
    formData.append("category[title]", values.title);
    formData.append("category[description]", values.description);
    if (categoryFileList.length > 0) {
      formData.append("category[image]", categoryFileList[0].originFileObj);
    } else {
      formData.append("category[image_url]", values.image_url);
    }

    const response = await UpdateCategoryApi(cookies.jwt, formData, selectedCategoryID);
    if (response) {
      notification.success({message: "Category updated successfully!"});
    } else {
      notification.error({message: "Error updating category!"});
    }
    setModalVisible(false);
    fetchCategories();
  };

  const handleSaveNewCategory = async (values) => {
    const formData = new FormData();
    formData.append("category[title]", values.title);
    formData.append("category[description]", values.description);
    if (categoryFileList.length > 0) {
      formData.append("category[image]", categoryFileList[0].originFileObj);
    }
    // if (chefFileList.length > 0) {
    //   formData.append("category[chef_image]", chefFileList[0].originFileObj);
    // }
    const chefData = new FormData();
    chefData.append("chef[first_name]", values.first_name);
    chefData.append("chef[last_name]", values.last_name);
    chefData.append("chef[email]", values.email);
    chefData.append("chef[phone_number]", values.phone_number);
    chefData.append("chef[age]", values.age);
    chefData.append("chef[salary]", values.salary);
    chefData.append("chef[password]", values.password);
    if (chefFileList.length > 0) {
      chefData.append("chef[profile_image]", chefFileList[0].originFileObj);
    }

    const response = await NewCategoryApi(cookies.jwt, formData);
    if (response) {
      chefData.append("chef[category_id]", response.data.id);
      const chefResponse = await AddNewChefApi(cookies.jwt, chefData);
      if (chefResponse) {
        notification.success({message: "Category and chef added successfully!"});
        setAddCategoryModalVisible(false);
        fetchCategories();
      }
    } else {
      notification.error({message: "Error adding new category and chef!"});
    }
  };
  const handleSaveChefChanges = async (values) => {
    const formData = new FormData();
    formData.append("chef[first_name]", values.first_name);
    formData.append("chef[last_name]", values.last_name);
    formData.append("chef[email]", values.email);
    formData.append("chef[phone_number]", values.phone_number);
    formData.append("chef[age]", values.age);
    formData.append("chef[salary]", values.salary);
    if (chefFileList.length > 0) {
      formData.append("chef[profile_image]", chefFileList[0].originFileObj);
    } else {
      formData.append("chef[profile_image_url]", values.profile_image);
    }

    const response = await UpdateChefApi(cookies.jwt, formData, categoryChefId);
    if (response) {
      notification.success({message: "Chef updated successfully!"});
      setEditChefModalVisible(false);
    } else {
      notification.error({message: "Error updating chef!"});
    }
  }
  const handleAddCategory = () => {
    setAddCategoryModalVisible(true);
  };

  const handleEditChef = (id) => {
    setCategoryChefId(id);
    setEditChefModalVisible(true);
  };

  const columns = [
    {title: "ID", dataIndex: "id", key: "id"},
    {title: "Title", dataIndex: "title", key: "title"},
    {title: "Number of Foods", dataIndex: "num_of_foods", key: "num_of_foods"},
    {title: "Number of Ingredients", dataIndex: "num_of_ingredients", key: "num_of_ingredients"},
    {title: "Chef Name", dataIndex: "chef_name", key: "chef_name"},
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <div>
          <Button
            icon={<EditOutlined/>}
            onClick={() => handleEditCategory(record.id)}
            style={{backgroundColor: "#ffbe33", color: "#fff", marginRight: "8px"}}
          />
          <Button
            icon={<DeleteOutlined/>}
            onClick={() => handleRemoveCategory(record.id)}
            danger
          />
          <button
            style={{
              backgroundColor: "#ff6600",
              color: "#fff",
              border: "none",
              padding: "8px",
              cursor: "pointer",
              marginLeft: "8px",
              borderRadius: "5px",
            }}
            onClick={() => {
              handleEditChef(record.id);
              // setCategoryChefId(record.id);
            }}
          >
            Edit Chef
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="manage-categories-container">
      <div className="header">
        <h1>Manage Categories</h1>
        <button onClick={handleAddCategory} className="add-category-btn">
          <PlusOutlined/> Add New Category
        </button>
      </div>

      <div className="table-container">
        <Table columns={columns} dataSource={categories} rowKey="id" pagination={false} bordered/>
      </div>

      {/* Add New Category Modal */}
      <Modal
        title="Add New Category & Assign Chef"
        open={addCategoryModalVisible}
        onCancel={() => setAddCategoryModalVisible(false)}
        footer={null}
      >
        <Form onFinish={handleSaveNewCategory} layout="vertical">
          <Form.Item label="Category Title" name="title"
                     rules={[{required: true, message: "Please input the category title!"}]}>
            <Input/>
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea rows={4}/>
          </Form.Item>
          <Form.Item label="Category Image">
            <Upload
              fileList={categoryFileList}
              onChange={handleCategoryFileChange}
              maxCount={1}
              beforeUpload={beforeUpload}
              accept=".jpg,.jpeg,.png"
            >
              {categoryImageUrl ? (
                <img
                  src={categoryImageUrl}
                  alt="Category"
                  style={{width: "100%", maxHeight: "150px", objectFit: "cover"}}
                />
              ) : (
                <div>
                  <UploadOutlined/>
                  <div>Upload Category Image</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          {/* Assign Chef Section */}
          <h3>Assign Chef</h3>
          <Form.Item label="First Name" name="first_name"
                     rules={[{required: true, message: "Please input the chef's first name!"}]}>
            <Input/>
          </Form.Item>
          <Form.Item label="Last Name" name="last_name"
                     rules={[{required: true, message: "Please input the chef's last name!"}]}>
            <Input/>
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{required: true, message: "Please input the chef's email!"}]}>
            <Input/>
          </Form.Item>
          <Form.Item label="Phone Number" name="phone_number">
            <Input/>
          </Form.Item>
          <Form.Item label="Age" name="age">
            <InputNumber style={{width: "100%"}}/>
          </Form.Item>
          <Form.Item label="Salary" name="salary">
            <InputNumber style={{width: '100%'}}/>
          </Form.Item>
          <Form.Item label={"Chef Image"}>
            <Upload
              fileList={chefFileList}
              onChange={handleChefFileChange}
              beforeUpload={beforeUpload}
              maxCount={1}
              accept=".jpg,.jpeg,.png"
            >
              {chefImageUrl ? (
                <img
                  src={chefImageUrl}
                  alt="Chef"
                  style={{width: "100%", maxHeight: "150px", objectFit: "cover"}}
                />
              ) : (
                <div>
                  <UploadOutlined/>
                  {/*<div>Upload Chef Image</div>*/}
                </div>
              )}
            </Upload>
          </Form.Item>
          <Form.Item label={"Password"} name={"password"}>
            <Input.Password/>
          </Form.Item>

          <div className="modal-actions">
            <Button onClick={() => setAddCategoryModalVisible(false)}
                    style={{backgroundColor: "#242424", color: "#fff"}}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" style={{backgroundColor: "#ff6600"}}>
              Add Category & Assign Chef
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Edit Chef Modal */}
      <Modal
        title="Edit Chef"
        open={editChefModalVisible}
        onCancel={() => setEditChefModalVisible(false)}
        footer={null}

      >
        <Form layout="vertical" form={form} onFinish={handleSaveChefChanges}>
          <Form.Item label="Chef First Name" name="first_name" initialValue={chefDetails?.first_name}>
            <Input/>
          </Form.Item>
          <Form.Item label="Chef Last Name" name="last_name" initialValue={chefDetails?.last_name}>
            <Input/>
          </Form.Item>
          <Form.Item label="Chef Email" name="email" initialValue={chefDetails?.email}>
            <Input/>
          </Form.Item>
          <Form.Item label="Chef Phone Number" name="phone_number" initialValue={chefDetails?.phone_number}>
            <Input/>
          </Form.Item>
          <Form.Item label="Chef Age" name="age" initialValue={chefDetails?.age}>
            <InputNumber style={{width: "100%"}}/>
          </Form.Item>
          <Form.Item label="Chef Salary" name="salary" initialValue={chefDetails?.salary}>
            <InputNumber style={{width: "100%"}}/>
          </Form.Item>
          <Form.Item label="Chef Image">
            <Upload
              fileList={chefFileList}
              onChange={handleChefFileChange}
              beforeUpload={beforeUpload}
              maxCount={1}
              accept=".jpg,.jpeg,.png"
            >
              {chefImageUrl ? (
                <img
                  src={chefImageUrl}
                  alt="Chef"
                  style={{width: "100%", maxHeight: "150px", objectFit: "cover"}}
                />
              ) : (
                <div>
                  <UploadOutlined/>
                  <div>Upload Chef Image</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <div className="modal-actions">
            <Button onClick={() => setEditChefModalVisible(false)} style={{backgroundColor: "#242424", color: "#fff"}}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" style={{backgroundColor: "#ff6600"}}>
              Save Changes
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Edit Category Modal */}
      <Modal
        title="Edit Category"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleSaveCategoryChanges} layout="vertical">
          <Form.Item label="Category Title" name="title"
                     rules={[{required: true, message: "Please input the category title!"}]}>
            <Input/>
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea rows={4}/>
          </Form.Item>
          <Form.Item label="Category Image">
            <Upload
              fileList={categoryFileList}
              onChange={handleCategoryFileChange}
              maxCount={1}
              accept=".jpg,.jpeg,.png"
            >
              {categoryImageUrl ? (
                <img
                  src={categoryImageUrl}
                  alt="Category"
                  style={{width: "100%", maxHeight: "150px", objectFit: "cover"}}
                />
              ) : (
                <div>
                  <UploadOutlined/>
                  <div>Upload Category Image</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <div className="modal-actions">
            <Button onClick={() => setModalVisible(false)} style={{backgroundColor: "#242424", color: "#fff"}}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" style={{backgroundColor: "#ff6600"}}>
              Save Changes
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
