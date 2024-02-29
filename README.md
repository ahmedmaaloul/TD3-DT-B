## Projects

### Basic Implementation

The basic implementation is the simplest version, using MongoDB as a single database without any redundancy or replication.

- **Location:** `Basic_Implementation/`
- **Database:** MongoDB
- **Features:**
  - CRUD operations for products, carts, and orders.
  - No data redundancy.
  - Single database instance.

### Synchronous Mirroring

This implementation adds synchronous mirroring to the basic setup, which ensures real-time data availability across two different storage systems.

- **Location:** `Synchronous_Mirroring/`
- **Primary Database:** MongoDB
- **Secondary Database:** PostgreSQL
- **Features:**
  - Real-time data mirroring.
  - Zero data loss on failover (zero RPO).
  - Immediate recovery (zero RTO).

### Asynchronous Replication

This version implements asynchronous replication, which provides redundancy by periodically copying data from the primary to a secondary location.

- **Location:** `Asynchronous_Replication/`
- **Primary Database:** MongoDB
- **Secondary Database:** PostgreSQL
- **Features:**
  - Data replication with a delay (asynchronous).
  - Suitable for disaster recovery across geographically dispersed locations.
  - Trade-off between replication lag and system performance.
