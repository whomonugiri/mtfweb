import { useContext, useState, useEffect, useRef } from "react";
import { AppContext } from "../../utils/AppProvider";
import { PrimaryButton } from "../elements/PrimaryButton";
import {
  ADD_PROJECT,
  GET_PROJECT,
  UPDATE_PROJECT,
  SEARCH_CLIENTS,
} from "../../api/endpoints";
import { Link, useNavigate, useParams, useSearchParams } from "react-router";
import { singleCall, getCall } from "../../api/functions";
import ContentEditable from "react-contenteditable";

export const AddProject = () => {
  const { userData } = useContext(AppContext);
  const [busy, setBusy] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { projectId } = useParams();

  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [clients, setClients] = useState([]);
  const [clientSearchTerm, setClientSearchTerm] = useState("");
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const [form, setForm] = useState({
    projectName: "",
    clientId: "",
    clientName: "",
    projectDescription: "",
    status: "pending",
    deadline: "",
  });

  const [errors, setErrors] = useState({});

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".position-relative")) {
        setShowClientDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch project data if projectId is provided
  useEffect(() => {
    if (projectId) {
      setIsLoading(true);
      singleCall(
        GET_PROJECT,
        { projectId },
        (data) => {
          if (data.data) {
            setForm({
              projectName: data.data.projectName || "",
              clientId: data.data.clientId?._id || data.data.clientId || "",
              clientName: data.data.clientId?.clientName || "",
              projectDescription: data.data.projectDescription || "",
              status: data.data.status || "pending",
              deadline: data.data.deadline
                ? new Date(data.data.deadline).toISOString().split("T")[0]
                : "",
            });
            setSelectedClient(data.data.clientId);
            setClientSearchTerm(data.data.clientId?.clientName || "");
            setIsUpdateMode(true);
          }
          setIsLoading(false);
        },
        () => {
          setIsLoading(false);
          setIsUpdateMode(false);
        }
      );
    }
  }, [projectId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const contentEditableRef = useRef(null);

  const handleDescriptionChange = (evt) => {
    const html = evt.target.value;
    setForm({ ...form, projectDescription: html });
  };

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    contentEditableRef.current?.focus();
  };

  const formatButtons = [
    { command: "bold", icon: "B", title: "Bold" },
    { command: "italic", icon: "I", title: "Italic" },
    { command: "underline", icon: "U", title: "Underline" },
    { command: "insertUnorderedList", icon: "•", title: "Bullet List" },
    { command: "insertOrderedList", icon: "1.", title: "Numbered List" },
    { command: "createLink", icon: "🔗", title: "Link" },
  ];

  const handleClientSearch = (e) => {
    const searchTerm = e.target.value;
    setClientSearchTerm(searchTerm);
    setForm({ ...form, clientId: "", clientName: "" });
    setSelectedClient(null);

    if (searchTerm.trim().length > 0) {
      // Debounce search
      clearTimeout(window.clientSearchTimeout);
      window.clientSearchTimeout = setTimeout(() => {
        getCall(
          `${SEARCH_CLIENTS}?search=${encodeURIComponent(searchTerm)}&limit=10`,
          (data) => {
            if (data.data && Array.isArray(data.data)) {
              setClients(data.data);
              setShowClientDropdown(true);
            }
          }
        );
      }, 300);
    } else {
      setClients([]);
      setShowClientDropdown(false);
    }
  };

  const selectClient = (client) => {
    setForm({
      ...form,
      clientId: client._id,
      clientName: client.clientName,
    });
    setSelectedClient(client);
    setClientSearchTerm(client.clientName);
    setShowClientDropdown(false);
    setErrors({ ...errors, clientId: "" });
  };

  const validate = () => {
    let newErrors = {};

    if (!form.projectName.trim()) {
      newErrors.projectName = "Project name is required";
    }

    if (!form.clientId) {
      newErrors.clientId = "Client selection is required";
    }

    if (!form.deadline) {
      newErrors.deadline = "Deadline is required";
    } else {
      const deadlineDate = new Date(form.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (deadlineDate <= today) {
        newErrors.deadline = "Deadline must be a future date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSuccess = (data) => {
    navigate("/manage-projects", { replace: true });
    setBusy(false);
  };

  const onFail = () => {
    setBusy(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;
    setBusy(true);

    // Strip HTML tags to check if there's actual content
    const textContent = form.projectDescription.replace(/<[^>]*>/g, "").trim();

    const dataToSend = {
      ...form,
      projectDescription: textContent ? form.projectDescription : "",
    };

    if (isUpdateMode && projectId) {
      dataToSend.projectId = projectId;
    }

    const endpoint = isUpdateMode ? UPDATE_PROJECT : ADD_PROJECT;

    singleCall(endpoint, dataToSend, onSuccess, onFail);
  };

  return (
    <div className="container mt-3">
      <div className="card shadow-sm">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0 text-center fw-bold">
            {isUpdateMode ? "Update Project" : "Add New Project"}
          </h5>
          <Link
            to="/manage-projects"
            className="btn btn-sm btn-outline-success"
          >
            Manage Projects
          </Link>
        </div>

        <div className="card-body">
          {isLoading ? (
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Project Name */}
              <div className="mb-3">
                <label className="form-label">
                  Project Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    errors.projectName ? "is-invalid" : ""
                  }`}
                  name="projectName"
                  value={form.projectName}
                  onChange={handleChange}
                  placeholder="Enter project name"
                />
                <div className="invalid-feedback">{errors.projectName}</div>
              </div>

              {/* Client Selection */}
              <div className="mb-3 position-relative">
                <label className="form-label">
                  Client <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    errors.clientId ? "is-invalid" : ""
                  }`}
                  value={clientSearchTerm}
                  onChange={handleClientSearch}
                  placeholder="Search for a client..."
                  autoComplete="off"
                />
                {showClientDropdown && clients.length > 0 && (
                  <div
                    className="dropdown-menu show w-100"
                    style={{ maxHeight: "200px", overflowY: "auto" }}
                  >
                    {clients.map((client) => (
                      <button
                        key={client._id}
                        type="button"
                        className="dropdown-item"
                        onClick={() => selectClient(client)}
                      >
                        <div className="d-flex flex-column">
                          <strong>{client.clientName}</strong>
                          <small className="text-muted">
                            {client.mobileNumber}
                            {client.email && ` • ${client.email}`}
                          </small>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {selectedClient && (
                  <div className="mt-2 p-2 bg-light rounded">
                    <strong>Selected: {selectedClient.clientName}</strong>
                    <br />
                    <small className="text-muted">
                      {selectedClient.mobileNumber}
                      {selectedClient.email && ` • ${selectedClient.email}`}
                    </small>
                  </div>
                )}
                <div className="invalid-feedback">{errors.clientId}</div>
              </div>

              {/* Project Description */}
              <div className="mb-3">
                <label className="form-label">
                  Project Description (Optional)
                </label>
                <div className="border rounded" style={{ minHeight: "120px" }}>
                  {/* Formatting Toolbar */}
                  <div className="d-flex gap-1 p-2 border-bottom bg-light">
                    {formatButtons.map((btn) => (
                      <button
                        key={btn.command}
                        type="button"
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => execCommand(btn.command)}
                        title={btn.title}
                        style={{
                          minWidth: "30px",
                          fontWeight:
                            btn.command === "bold" ? "bold" : "normal",
                          fontStyle:
                            btn.command === "italic" ? "italic" : "normal",
                          textDecoration:
                            btn.command === "underline" ? "underline" : "none",
                        }}
                      >
                        {btn.icon}
                      </button>
                    ))}
                  </div>

                  {/* Content Editable Area */}
                  <ContentEditable
                    innerRef={contentEditableRef}
                    html={form.projectDescription}
                    onChange={handleDescriptionChange}
                    className="form-control border-0"
                    style={{
                      minHeight: "100px",
                      padding: "12px 15px",
                      outline: "none",
                      borderRadius: "0 0 0.375rem 0.375rem",
                    }}
                    placeholder="Enter project description with rich text formatting..."
                  />
                </div>
              </div>

              {/* Status */}
              <div className="mb-3">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="on-hold">On Hold</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Deadline */}
              <div className="mb-3">
                <label className="form-label">
                  Deadline <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  className={`form-control ${
                    errors.deadline ? "is-invalid" : ""
                  }`}
                  name="deadline"
                  value={form.deadline}
                  onChange={handleChange}
                />
                <div className="invalid-feedback">{errors.deadline}</div>
              </div>

              <PrimaryButton
                action={() => {}}
                label={isUpdateMode ? "UPDATE PROJECT" : "ADD PROJECT"}
                busy={busy}
              />
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
