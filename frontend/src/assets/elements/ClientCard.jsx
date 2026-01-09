import { useNavigate } from "react-router";
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiFileText,
  FiCalendar,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";

export const ClientCard = ({ client, onDelete }) => {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/update-client/${client._id}`);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      onDelete(client._id);
    }
  };

  const initials = (name) => {
    if (!name) return "CL";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
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

  const createdAt = client?.createdAt || client?.updatedAt || null;

  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body d-flex gap-3 align-items-start">
        <div className="d-flex align-items-center justify-content-center">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center text-white"
            style={{
              width: 52,
              height: 52,
              background: "#0d6efd",
              fontWeight: 700,
            }}
          >
            {initials(client.clientName)}
          </div>
        </div>

        <div className="flex-grow-1">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h5 className="mb-1 fw-semibold">{client.clientName}</h5>
              <div className="d-flex align-items-center gap-2 small text-muted">
                <FiPhone className="text-primary" />
                <span className="text-primary fw-medium">
                  {client.mobileNumber}
                </span>
              </div>
            </div>

            <div className="d-flex flex-column align-items-end ms-3">
              <div className="d-flex gap-2">
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

          <div className="mt-1">
            {client.email && (
              <div className="d-flex align-items-center gap-2 mb-1 small">
                <FiMail className="text-secondary" />
                <span className="text-muted">{client.email}</span>
              </div>
            )}

            {client.gstNumber && (
              <div className="d-flex align-items-center gap-2 mb-1 small">
                <FiFileText className="text-secondary" />
                <span className="text-muted">{client.gstNumber}</span>
              </div>
            )}

            {client.address && (
              <div className="d-flex align-items-start gap-2 small">
                <FiMapPin className="text-secondary mt-1" />
                <p
                  className="mb-0 text-muted"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {client.address}
                </p>
              </div>
            )}
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
