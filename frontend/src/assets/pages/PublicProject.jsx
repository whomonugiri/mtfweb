import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { getCall } from "../../api/functions";
import { GET_PUBLIC_PROJECT, HOST } from "../../api/endpoints";
import {
  FiUser,
  FiCalendar,
  FiClock,
  FiFileText,
  FiCheckCircle,
  FiAlertCircle,
  FiPlayCircle,
  FiPauseCircle,
} from "react-icons/fi";

export const PublicProject = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [project, setProject] = useState(null);
  const { projectId } = useParams();

  // Fetch project data
  useEffect(() => {
    if (projectId) {
      setIsLoading(true);
      getCall(
        `${GET_PUBLIC_PROJECT}/${projectId}`,
        (data) => {
          if (data.data) {
            setProject(data.data);
          }
          setIsLoading(false);
        },
        () => {
          setIsLoading(false);
        }
      );
    }
  }, [projectId]);

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

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <FiCheckCircle className="text-success" size={24} />;
      case "in-progress":
        return <FiPlayCircle className="text-primary" size={24} />;
      case "on-hold":
        return <FiPauseCircle className="text-warning" size={24} />;
      case "pending":
      default:
        return <FiAlertCircle className="text-secondary" size={24} />;
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

  const getProgressPercentage = (status) => {
    switch (status) {
      case "completed":
        return 100;
      case "in-progress":
        return 75;
      case "on-hold":
        return 50;
      case "pending":
      default:
        return 25;
    }
  };

  if (isLoading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <div
            className="spinner-border text-primary mb-3"
            role="status"
            style={{ width: "3rem", height: "3rem" }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <h5 className="text-muted">Loading project details...</h5>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <FiAlertCircle size={64} className="text-muted mb-4" />
          <h3 className="text-muted mb-3">Project Not Found</h3>
          <p className="text-muted">
            The project you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  const progressPercentage = getProgressPercentage(project.status);

  return (
    <div className="min-vh-100 bg-light">
      {/* Header */}
      <div className="bg-white shadow-sm border-bottom">
        <div className="container py-4">
          <div className="row align-items-center">
            <div className="col-12 col-md-8">
              <div className="d-flex align-items-center gap-3 mb-2">
                {getStatusIcon(project.status)}
                <div>
                  <h1 className="h3 mb-1 fw-bold text-dark">
                    {project.projectName}
                  </h1>
                  <p className="text-muted mb-0">
                    Project ID: {project.projectId}
                  </p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4 text-md-end mt-2 mt-md-0">
              <span
                className={`badge fs-6 px-3 py-2 bg-${getStatusColor(
                  project.status
                )}`}
              >
                {getStatusText(project.status)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-4">
        <div className="row">
          {/* Project Details */}
          <div className="col-12 col-lg-8 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <h5 className="card-title mb-4 text-dark fw-bold">
                  Project Details
                </h5>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-medium text-dark">Progress</span>
                    <span className="text-muted">{progressPercentage}%</span>
                  </div>
                  <div className="progress" style={{ height: "8px" }}>
                    <div
                      className={`progress-bar bg-${getStatusColor(
                        project.status
                      )}`}
                      role="progressbar"
                      style={{ width: `${progressPercentage}%` }}
                      aria-valuenow={progressPercentage}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                </div>

                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="d-flex align-items-start gap-3">
                      <div className="bg-light rounded-circle p-2">
                        <FiUser className="text-primary" size={20} />
                      </div>
                      <div>
                        <h6 className="mb-1 fw-bold text-dark">Client</h6>
                        <p className="mb-1 text-dark fw-medium">
                          {project.clientId?.clientName || "Unknown Client"}
                        </p>
                        {project.clientId?.email && (
                          <p className="mb-1 text-muted small">
                            <i className="bi bi-envelope me-1"></i>
                            {project.clientId.email}
                          </p>
                        )}
                        {project.clientId?.mobileNumber && (
                          <p className="mb-0 text-muted small">
                            <i className="bi bi-telephone me-1"></i>
                            {project.clientId.mobileNumber}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="d-flex align-items-start gap-3">
                      <div className="bg-light rounded-circle p-2">
                        <FiClock
                          className={`text-${
                            project.status === "completed"
                              ? "success"
                              : project.deadline > new Date()
                              ? "success"
                              : "danger"
                          }`}
                          size={20}
                        />
                      </div>
                      <div>
                        <h6 className="mb-1 fw-bold text-dark">
                          {project.status === "completed"
                            ? "Completed"
                            : "Deadline"}
                        </h6>
                        <p
                          className={`mb-1 fw-medium ${
                            project.status === "completed"
                              ? "text-success"
                              : project.deadline > new Date()
                              ? "text-success"
                              : "text-danger"
                          }`}
                        >
                          {project.status === "completed"
                            ? formatDateTime(project.updatedAt)
                            : `${formatDeadline(project.deadline)}`}
                        </p>
                        {project.status !== "completed" && (
                          <p className="mb-0 text-muted small">
                            {formatDateTime(project.deadline)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {project.projectDescription && (
                  <div className="mt-4">
                    <div className="d-flex align-items-start gap-3">
                      <div className="bg-light rounded-circle p-2">
                        <FiFileText className="text-secondary" size={20} />
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="mb-3 fw-bold text-dark">Description</h6>
                        <div
                          className="text-muted"
                          style={{
                            lineHeight: "1.6",
                            fontSize: "0.95rem",
                          }}
                          dangerouslySetInnerHTML={{
                            __html: project.projectDescription,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-3 border-top">
                  <div className="d-flex align-items-center gap-3 text-muted small">
                    <FiCalendar size={16} />
                    <span>Created: {formatDateTime(project.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Logs */}
          <div className="col-12 col-lg-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <h5 className="card-title mb-4 text-dark fw-bold">
                  Progress Updates
                  <span className="badge bg-primary ms-2">
                    {project.logs?.length || 0}
                  </span>
                </h5>

                {project.logs && project.logs.length > 0 ? (
                  <div className="timeline">
                    {project.logs
                      .sort(
                        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
                      )
                      .slice(0, 10) // Show only latest 10 logs
                      .map((log, index) => (
                        <div key={index} className="timeline-item mb-3">
                          <div className="timeline-marker bg-primary"></div>
                          <div className="timeline-content">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <small className="text-muted fw-medium">
                                {formatDateTime(log.timestamp)}
                              </small>
                            </div>
                            <p className="mb-0 text-dark small">
                              {log.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    {project.logs.length > 10 && (
                      <div className="text-center mt-3">
                        <small className="text-muted">
                          And {project.logs.length - 10} more updates...
                        </small>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <FiFileText
                      size={48}
                      className="text-muted mb-3 opacity-50"
                    />
                    <p className="text-muted mb-0">No progress updates yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-light mt-5 py-4">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <p className="mb-0 small">
                Project tracking powered by MTF Online
              </p>
            </div>
            <div className="col-md-6 text-md-end">
              <p className="mb-0 small text-muted">
                This is a public view of the project. For full access, contact
                your project manager.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
