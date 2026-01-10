import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../utils/AppProvider";
import { PrimaryButton } from "../elements/PrimaryButton";
import {
  GET_PROJECT,
  ADD_PROJECT_LOG,
  UPDATE_PROJECT,
} from "../../api/endpoints";
import { Link, useNavigate, useParams } from "react-router";
import { singleCall } from "../../api/functions";
import {
  FiEdit2,
  FiUser,
  FiCalendar,
  FiClock,
  FiFileText,
  FiPlus,
  FiShare2,
} from "react-icons/fi";

export const OpenProject = () => {
  const { userData } = useContext(AppContext);
  const [busy, setBusy] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [project, setProject] = useState(null);
  const navigate = useNavigate();
  const { projectId } = useParams();

  const [logForm, setLogForm] = useState({
    description: "",
  });

  const [logErrors, setLogErrors] = useState({});

  // Fetch project data
  useEffect(() => {
    if (projectId) {
      setIsLoading(true);
      singleCall(
        GET_PROJECT,
        { projectId },
        (data) => {
          if (data.data) {
            setProject(data.data);
          }
          setIsLoading(false);
        },
        () => {
          setIsLoading(false);
          navigate("/manage-projects");
        }
      );
    }
  }, [projectId, navigate]);

  const handleLogChange = (e) => {
    const { name, value } = e.target;
    setLogForm({ ...logForm, [name]: value });
    setLogErrors({ ...logErrors, [name]: "" });
  };

  const validateLog = () => {
    let newErrors = {};

    if (!logForm.description.trim()) {
      newErrors.description = "Log description is required";
    }

    setLogErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddLog = (e) => {
    e.preventDefault();

    if (!validateLog()) return;
    setBusy(true);

    singleCall(
      ADD_PROJECT_LOG,
      {
        projectId,
        description: logForm.description.trim(),
      },
      (data) => {
        if (data.data) {
          setProject(data.data);
          setLogForm({ description: "" });
        }
        setBusy(false);
      },
      () => {
        setBusy(false);
      }
    );
  };

  const formatDateTime = (iso) => {
    if (!iso) return "";
    try {
      return new Date(iso).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch (e) {
      return new Date(iso).toLocaleString();
    }
  };

  const formatDeadline = (deadline) => {
    if (!deadline) return "";
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return `Overdue by ${Math.abs(diffDays)} days`;
    } else if (diffDays === 0) {
      return "Due today";
    } else if (diffDays === 1) {
      return "Due tomorrow";
    } else {
      return `Due in ${diffDays} days`;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "success";
      case "in-progress":
        return "primary";
      case "on-hold":
        return "warning";
      case "pending":
      default:
        return "secondary";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "in-progress":
        return "In Progress";
      case "on-hold":
        return "On Hold";
      case "pending":
      default:
        return "Pending";
    }
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/p/${projectId}`;
    navigator.clipboard
      .writeText(shareUrl)
      .then(() => {
        alert("Share link copied to clipboard!");
      })
      .catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        alert("Share link copied to clipboard!");
      });
  };

  if (isLoading) {
    return (
      <div className="container mt-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mt-4">
        <div className="text-center py-5">
          <h4>Project not found</h4>
          <Link to="/manage-projects" className="btn btn-primary mt-3">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4 mb-5">
      {/* Header */}
      <div className="card shadow-sm mb-4">
        <div className="card-header d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3">
          <div>
            <h4 className="mb-1 fw-bold">{project.projectName}</h4>
            <small className="text-muted">ID: {project.projectId}</small>
          </div>
          <div className="d-flex flex-wrap gap-2 w-100 w-sm-auto">
            <button
              className="btn btn-outline-success btn-sm flex-fill flex-sm-auto"
              onClick={handleShare}
            >
              <FiShare2 className="me-1" />
              Share
            </button>
            <Link
              to={`/update-project/${project.projectId}`}
              className="btn btn-outline-primary btn-sm flex-fill flex-sm-auto"
            >
              <FiEdit2 className="me-1" />
              Edit Project
            </Link>
            <Link
              to="/manage-projects"
              className="btn btn-outline-secondary btn-sm flex-fill flex-sm-auto"
            >
              Back to Projects
            </Link>
          </div>
        </div>

        <div className="card-body">
          <div className="row">
            <div className="col-12 col-md-6">
              <div className="mb-3">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <FiUser className="text-primary" />
                  <strong>Client:</strong>
                  <span>
                    {project.clientId?.clientName || "Unknown Client"}
                  </span>
                </div>
                {project.clientId?.email && (
                  <div className="d-flex align-items-center gap-2 mb-1 small text-muted">
                    <i className="bi bi-envelope"></i>
                    <span>{project.clientId.email}</span>
                  </div>
                )}
                {project.clientId?.mobileNumber && (
                  <div className="d-flex align-items-center gap-2 mb-1 small text-muted">
                    <i className="bi bi-telephone"></i>
                    <span>{project.clientId.mobileNumber}</span>
                  </div>
                )}
              </div>

              <div className="mb-3">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span
                    className={`badge bg-${getStatusColor(
                      project.status
                    )} fs-6`}
                  >
                    {getStatusText(project.status)}
                  </span>
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <FiClock
                    className={`text-${
                      project.status === "completed"
                        ? "success"
                        : project.deadline > new Date()
                        ? "success"
                        : "danger"
                    }`}
                  />
                  <strong>
                    {project.status === "completed"
                      ? "Completed:"
                      : "Deadline:"}
                  </strong>
                  <span
                    className={
                      project.status === "completed"
                        ? "text-success"
                        : project.deadline > new Date()
                        ? "text-success"
                        : "text-danger"
                    }
                  >
                    {project.status === "completed"
                      ? formatDateTime(project.updatedAt)
                      : `${formatDeadline(project.deadline)} (${formatDateTime(
                          project.deadline
                        )})`}
                  </span>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6">
              {project.projectDescription && (
                <div className="mb-3">
                  <div className="d-flex align-items-start gap-2">
                    <FiFileText className="text-secondary mt-1" />
                    <div>
                      <strong>Description:</strong>
                      <div
                        className="mt-1 text-muted"
                        dangerouslySetInnerHTML={{
                          __html: project.projectDescription,
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-3">
                <div className="d-flex align-items-center gap-2">
                  <FiCalendar className="text-secondary" />
                  <strong>Created:</strong>
                  <span className="text-muted">
                    {formatDateTime(project.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Log Form - Only show if project is not completed */}
      {project.status !== "completed" && (
        <div className="card shadow-sm mb-4">
          <div className="card-header">
            <h5 className="mb-0">
              <FiPlus className="me-2" />
              Add Progress Log
            </h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleAddLog}>
              <div className="mb-3">
                <label className="form-label">Log Description</label>
                <textarea
                  className={`form-control ${
                    logErrors.description ? "is-invalid" : ""
                  }`}
                  rows="3"
                  name="description"
                  value={logForm.description}
                  onChange={handleLogChange}
                  placeholder="Describe the progress or update for this project..."
                />
                <div className="invalid-feedback">{logErrors.description}</div>
              </div>
              <PrimaryButton action={() => {}} label="ADD LOG" busy={busy} />
            </form>
          </div>
        </div>
      )}

      {/* Logs History */}
      <div className="card shadow-sm">
        <div className="card-header">
          <h5 className="mb-0">Progress Logs ({project.logs?.length || 0})</h5>
        </div>
        <div className="card-body">
          {project.logs && project.logs.length > 0 ? (
            <div className="timeline">
              {project.logs
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .map((log, index) => (
                  <div key={index} className="timeline-item mb-4">
                    <div className="timeline-marker bg-primary"></div>
                    <div className="timeline-content">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <small className="text-muted fw-medium">
                          {formatDateTime(log.timestamp)}
                        </small>
                      </div>
                      <p className="mb-0 text-dark">{log.description}</p>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-4 text-muted">
              <FiFileText size={48} className="mb-3 opacity-50" />
              <p>
                No logs added yet. Start tracking progress by adding your first
                log above.
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .timeline {
          position: relative;
          padding-left: 30px;
        }

        .timeline::before {
          content: "";
          position: absolute;
          left: 15px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: #e9ecef;
        }

        .timeline-item {
          position: relative;
          margin-bottom: 20px;
        }

        .timeline-marker {
          position: absolute;
          left: -22px;
          top: 6px;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 0 0 2px #e9ecef;
        }

        .timeline-content {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          border-left: 3px solid #0d6efd;
        }
      `}</style>
    </div>
  );
};
