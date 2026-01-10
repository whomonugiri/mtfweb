import { useNavigate } from "react-router";
import {
  FiFileText,
  FiCalendar,
  FiEdit2,
  FiTrash2,
  FiUser,
  FiClock,
  FiEye,
  FiShare2,
} from "react-icons/fi";

export const ProjectCard = ({ project, onDelete }) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/update-project/${project.projectId}`);
  };

  const handleView = () => {
    navigate(`/project/${project.projectId}`);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      onDelete(project.projectId);
    }
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/p/${project.projectId}`;
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

  const createdAt = project?.createdAt || project?.updatedAt || null;

  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body d-flex flex-column flex-sm-row gap-3 align-items-start">
        <div className="d-flex align-items-center justify-content-center flex-shrink-0">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center text-white"
            style={{
              width: 52,
              height: 52,
              background: "#0d6efd",
              fontWeight: 700,
            }}
          >
            {project.projectName.charAt(0).toUpperCase()}
          </div>
        </div>

        <div className="flex-grow-1">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start">
            <div className="flex-grow-1 mb-3 mb-md-0">
              <h5 className="mb-1 fw-semibold">{project.projectName}</h5>
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className={`badge bg-${getStatusColor(project.status)}`}>
                  {getStatusText(project.status)}
                </span>
                <small className="text-muted">ID: {project.projectId}</small>
              </div>

              <div className="d-flex align-items-center gap-2 small text-muted mb-1">
                <FiUser className="text-primary" />
                <span className="text-primary fw-medium">
                  {project.clientId?.clientName || "Unknown Client"}
                </span>
              </div>

              {project.projectDescription && (
                <div className="d-flex align-items-start gap-2 small mb-1">
                  <FiFileText className="text-secondary mt-1" />
                  <div
                    className="mb-0 text-muted"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: project.projectDescription,
                    }}
                  />
                </div>
              )}

              <div className="d-flex align-items-center gap-2 small">
                <FiClock
                  className={
                    project.status === "completed"
                      ? "text-success"
                      : "text-warning"
                  }
                />
                <span
                  className={`text-${
                    project.status === "completed"
                      ? "success"
                      : project.deadline > new Date()
                      ? "success"
                      : "danger"
                  } fw-medium`}
                >
                  {project.status === "completed"
                    ? `Completed on ${formatDateTime(project.updatedAt)}`
                    : formatDeadline(project.deadline)}
                </span>
              </div>
            </div>

            <div className="d-flex flex-wrap gap-1 align-items-center">
              <button
                className="btn btn-sm btn-outline-info"
                onClick={handleView}
                title="View Details"
              >
                <FiEye />
              </button>
              <button
                className="btn btn-sm btn-outline-success"
                onClick={handleShare}
                title="Share Public Link"
              >
                <FiShare2 />
              </button>
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={handleEdit}
                title="Edit"
              >
                <FiEdit2 />
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={handleDelete}
                title="Delete"
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center p-1 border-top">
        <small
          style={{ opacity: 0.65, fontSize: 12, marginTop: 8 }}
          className="text-muted"
        >
          <FiCalendar style={{ verticalAlign: "-3px" }} />{" "}
          {formatDateTime(createdAt)}
        </small>
      </div>
    </div>
  );
};
