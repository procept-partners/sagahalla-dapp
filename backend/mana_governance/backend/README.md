# MANA GOVERNANCE SYSTEM - BACKEND

This is the backend for the MANA Governance System, built using **FastAPI**. The backend handles core functionalities of the MANA decentralized application such as governance voting, proposal submission, MANA allocation and MANA conversion, with voting results weighted by members' MANA contributions. It exposes a RESTful API and provides real-time update for the frontend through websockets or similar real-time protocols.

## Table of Contents
1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Technologies Used](#technologies-used)



## Project Overview

The backend serves the following purposes:
- Managing weighted governance voting based on users' MANA contributions.
- Allowing users to submit vote on governance proposals.
- Handling MANA allocation, conversion, and token balances.
- Providing real-time updates on voting results and proposal statuses.
- Generating reports on governance decisions for auditing and review.


## Features
- **Weighted Voting**: Votes are weighted by users' MANA holdings.
- **Proposal Submission**: Users can submit proposals for governance and vote on them.
- **MANA Conversion**: Converts approved MANA hours into MANA tokens.
- **Real-Time Updates**: Websocket support for real-time voting results.
- **Secure API**: Authenticated routes and secure data handling.


## Technologies Used
- **FastAPI**: A high-performance Python framework for building APIs.
- **SQLITE**: Relational database for data storage.
- **SQLAlchemy**: ORM(Object Relational Mapper) used for interacting with the database.
- **Alembic**: For database migrations.
- **Websocktes**: For real-time data updates.
- **Docker**: Containerization for consistent development environments.
