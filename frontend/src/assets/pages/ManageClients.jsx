import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router";
import { ClientCard } from "../elements/ClientCard";
import { singleCall, getCall } from "../../api/functions";
import { DELETE_CLIENT, GET_ALL_CLIENTS } from "../../api/endpoints";
import { IoMdPersonAdd } from "react-icons/io";

export const ManageClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [initialLoad, setInitialLoad] = useState(true);
  const observerTarget = useRef(null);

  const ITEMS_PER_PAGE = 10;

  // Fetch clients
  const fetchClients = useCallback(() => {
    if (loading || !hasMore) return;

    setLoading(true);
    getCall(
      `${GET_ALL_CLIENTS}?page=${page}&limit=${ITEMS_PER_PAGE}`,
      (data) => {
        if (data.data && Array.isArray(data.data)) {
          if (page === 1) {
            setClients(data.data);
          } else {
            setClients((prev) => [...prev, ...data.data]);
          }

          // If fetched less than items per page, no more items to load
          if (data.data.length < ITEMS_PER_PAGE) {
            setHasMore(false);
          }
        }
        setLoading(false);
        setInitialLoad(false);
      },
      () => {
        setLoading(false);
        setInitialLoad(false);
      }
    );
  }, [page, loading, hasMore]);

  // Initial load
  useEffect(() => {
    if (initialLoad) {
      fetchClients();
    }
  }, [initialLoad, fetchClients]);

  // Handle delete
  const handleDeleteClient = (clientId) => {
    singleCall(
      DELETE_CLIENT,
      { clientId },
      () => {
        setClients(clients.filter((c) => c._id !== clientId));
      },
      () => {}
    );
  };

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.5 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, loading]);

  // Trigger fetch when page changes
  useEffect(() => {
    if (page > 1) {
      fetchClients();
    }
  }, [page]);

  return (
    <div className="container mt-4 mb-5">
      <div className="col-md-8 mx-auto card shadow-sm mb-3 border-0">
        <div className="card-body d-flex justify-content-between align-items-top flex-wrap p-0 px-3 py-2">
          <div>
            <h2 className="card-title mb-1 fw-bold fs-5">Manage Clients</h2>
          </div>
          <div>
            <Link
              to="/add-client"
              className="btn btn-success btn-sm d-flex align-items-center gap-1"
            >
              <IoMdPersonAdd />
              Add
            </Link>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-8 mx-auto">
          {initialLoad ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3 text-muted">Loading clients...</p>
            </div>
          ) : clients.length > 0 ? (
            <>
              {clients.map((client) => (
                <ClientCard
                  key={client._id}
                  client={client}
                  onDelete={handleDeleteClient}
                />
              ))}

              {loading && (
                <div className="text-center py-4">
                  <div
                    className="spinner-border spinner-border-sm text-primary"
                    role="status"
                  >
                    <span className="visually-hidden">Loading more...</span>
                  </div>
                  <span className="ms-2 text-muted small">
                    Loading more clients...
                  </span>
                </div>
              )}

              {/* Intersection observer target */}
              <div ref={observerTarget}></div>
            </>
          ) : (
            <div className="text-center py-5 border rounded bg-light">
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>
                <i className="bi bi-inbox text-muted"></i>
              </div>
              <h4 className="text-dark">No Clients Yet</h4>
              <p className="text-muted mb-4">
                Start adding clients to manage them here.
              </p>
              <Link to="/add-client" className="btn btn-success btn-sm">
                <i className="bi bi-plus-circle-fill"></i> Add Your First Client
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
