#!/usr/bin/env node
/**
 * MCP Server generated from OpenAPI spec for incident-api-mcp v1.0.0
 * Generated on: 2026-06-18T21:26:11.342Z
 */

// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  type Tool,
  type CallToolResult,
  type CallToolRequest
} from "@modelcontextprotocol/sdk/types.js";

import { z, ZodError } from 'zod';
import { jsonSchemaToZod } from 'json-schema-to-zod';
import axios, { type AxiosRequestConfig, type AxiosError } from 'axios';
import { applyCustomAuth } from './auth.js';

/**
 * Type definition for JSON objects
 */
type JsonObject = Record<string, any>;

/**
 * Interface for MCP Tool Definition
 */
interface McpToolDefinition {
    name: string;
    description: string;
    inputSchema: any;
    method: string;
    pathTemplate: string;
    executionParameters: { name: string, in: string }[];
    requestBodyContentType?: string;
    securityRequirements: any[];
    tags?: string[];
    deprecated?: boolean;
}

/**
 * Server configuration
 */
export const SERVER_NAME = "incident-api-mcp";
export const SERVER_VERSION = "1.0.0";
// Base URL for the API, can be set via environment variable or determined from OpenAPI spec
export const API_BASE_URL = process.env.API_BASE_URL || "https://api.incident.io";
console.error("API_BASE_URL is set to:", API_BASE_URL);

/**
 * MCP Server instance
 */
const server = new Server(
    { name: SERVER_NAME, version: SERVER_VERSION },
    { capabilities: { tools: {} } }
);

/**
 * Map of tool definitions by name
 */
const toolDefinitionMap: Map<string, McpToolDefinition> = new Map([

  ["Actions_V1_List", {
    name: "Actions_V1_List",
    description: `[DEPRECATED] List all actions for an organisation.
(Tags: Actions V1)`,
    inputSchema: {"type":"object","properties":{"incident_id":{"description":"Find actions related to this incident","type":"string"},"is_follow_up":{"description":"Filter to actions marked as being follow up actions","type":"boolean"},"incident_mode":{"description":"Filter to actions from incidents of the given mode. If not set, only actions from `real` incidents are returned","enum":["real","test","tutorial"],"type":"string"}}},
    method: "get",
    pathTemplate: "/v1/actions",
    executionParameters: [{"name":"incident_id","in":"query"},{"name":"is_follow_up","in":"query"},{"name":"incident_mode","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Actions V1"],
    deprecated: true
  }],
  ["Actions_V1_Show", {
    name: "Actions_V1_Show",
    description: `[DEPRECATED] Get a single incident action.
(Tags: Actions V1)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"Unique identifier for the action","type":"string"}},"required":["id"]},
    method: "get",
    pathTemplate: "/v1/actions/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Actions V1"],
    deprecated: true
  }],
  ["Custom_Field_Options_V1_List", {
    name: "Custom_Field_Options_V1_List",
    description: `Show custom field options for a custom field
(Tags: Custom Field Options V1)`,
    inputSchema: {"type":"object","properties":{"page_size":{"default":25,"description":"Integer number of records to return","format":"int64","maximum":250,"type":"number"},"after":{"description":"A custom field option's ID. This endpoint will return a list of custom field options created after this option.","type":"string"},"custom_field_id":{"description":"The custom field to list options for.","type":"string"}},"required":["custom_field_id"]},
    method: "get",
    pathTemplate: "/v1/custom_field_options",
    executionParameters: [{"name":"page_size","in":"query"},{"name":"after","in":"query"},{"name":"custom_field_id","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Custom Field Options V1"],
    deprecated: false
  }],
  ["Custom_Field_Options_V1_Create", {
    name: "Custom_Field_Options_V1_Create",
    description: `Create a custom field option. If the sort key is not supplied, it'll default to 1000, so the option appears near the end of the list.
(Tags: Custom Field Options V1)`,
    inputSchema: {"type":"object","properties":{"requestBody":{"properties":{"custom_field_id":{"description":"ID of the custom field this option belongs to","type":"string"},"sort_key":{"default":1000,"description":"Sort key used to order the custom field options correctly","format":"int64","type":"number"},"value":{"description":"Human readable name for the custom field option","type":"string"}},"required":["custom_field_id","value"],"type":"object","description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/v1/custom_field_options",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Custom Field Options V1"],
    deprecated: false
  }],
  ["Custom_Field_Options_V1_Show", {
    name: "Custom_Field_Options_V1_Show",
    description: `Get a single custom field option
(Tags: Custom Field Options V1)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"Unique identifier for the custom field option","type":"string"}},"required":["id"]},
    method: "get",
    pathTemplate: "/v1/custom_field_options/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Custom Field Options V1"],
    deprecated: false
  }],
  ["Custom_Field_Options_V1_Update", {
    name: "Custom_Field_Options_V1_Update",
    description: `Update a custom field option
(Tags: Custom Field Options V1)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"Unique identifier for the custom field option","type":"string"},"requestBody":{"properties":{"sort_key":{"default":1000,"description":"Sort key used to order the custom field options correctly","format":"int64","type":"number"},"value":{"description":"Human readable name for the custom field option","type":"string"}},"required":["value","sort_key"],"type":"object","description":"The JSON request body."}},"required":["id","requestBody"]},
    method: "put",
    pathTemplate: "/v1/custom_field_options/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Custom Field Options V1"],
    deprecated: false
  }],
  ["Custom_Field_Options_V1_Delete", {
    name: "Custom_Field_Options_V1_Delete",
    description: `Delete a custom field option
(Tags: Custom Field Options V1)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"Unique identifier for the custom field option","type":"string"}},"required":["id"]},
    method: "delete",
    pathTemplate: "/v1/custom_field_options/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Custom Field Options V1"],
    deprecated: false
  }],
  ["Custom_Fields_V1_List", {
    name: "Custom_Fields_V1_List",
    description: `[DEPRECATED] List all custom fields for an organisation.
(Tags: Custom Fields V1)`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/v1/custom_fields",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Custom Fields V1"],
    deprecated: true
  }],
  ["Custom_Fields_V1_Create", {
    name: "Custom_Fields_V1_Create",
    description: `[DEPRECATED] Create a new custom field
(Tags: Custom Fields V1)`,
    inputSchema: {"type":"object","properties":{"requestBody":{"properties":{"description":{"description":"Description of the custom field","type":"string"},"field_type":{"description":"Type of custom field","enum":["single_select","multi_select","text","link","numeric"],"type":"string"},"name":{"description":"Human readable name for the custom field","maxLength":50,"type":"string"},"required":{"description":"When this custom field must be set during the incident lifecycle. [DEPRECATED: please use required_v2 instead].","enum":["never","before_closure","always"],"type":"string"},"required_v2":{"description":"When this custom field must be set during the incident lifecycle.","enum":["never","before_resolution","always"],"type":"string"},"show_before_closure":{"description":"Whether a custom field should be shown in the incident resolve modal. If this custom field is required before resolution, but no value has been set for it, the field will be shown in the resolve modal whatever the value of this setting.","type":"boolean"},"show_before_creation":{"description":"Whether a custom field should be shown in the incident creation modal. This must be true if the field is always required.","type":"boolean"},"show_before_update":{"description":"Whether a custom field should be shown in the incident update modal.","type":"boolean"},"show_in_announcement_post":{"description":"Whether a custom field should be shown in the list of fields as part of the announcement post when set.","type":"boolean"}},"required":["name","description","field_type","show_before_creation","show_before_closure","show_before_update"],"type":"object","description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/v1/custom_fields",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Custom Fields V1"],
    deprecated: true
  }],
  ["Custom_Fields_V1_Show", {
    name: "Custom_Fields_V1_Show",
    description: `[DEPRECATED] Get a single custom field.
(Tags: Custom Fields V1)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"Unique identifier for the custom field","type":"string"}},"required":["id"]},
    method: "get",
    pathTemplate: "/v1/custom_fields/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Custom Fields V1"],
    deprecated: true
  }],
  ["Custom_Fields_V1_Update", {
    name: "Custom_Fields_V1_Update",
    description: `[DEPRECATED] Update the details of a custom field
(Tags: Custom Fields V1)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"Unique identifier for the custom field","type":"string"},"requestBody":{"properties":{"description":{"description":"Description of the custom field","type":"string"},"name":{"description":"Human readable name for the custom field","maxLength":50,"type":"string"},"required":{"description":"When this custom field must be set during the incident lifecycle. [DEPRECATED: please use required_v2 instead].","enum":["never","before_closure","always"],"type":"string"},"required_v2":{"description":"When this custom field must be set during the incident lifecycle.","enum":["never","before_resolution","always"],"type":"string"},"show_before_closure":{"description":"Whether a custom field should be shown in the incident resolve modal. If this custom field is required before resolution, but no value has been set for it, the field will be shown in the resolve modal whatever the value of this setting.","type":"boolean"},"show_before_creation":{"description":"Whether a custom field should be shown in the incident creation modal. This must be true if the field is always required.","type":"boolean"},"show_before_update":{"description":"Whether a custom field should be shown in the incident update modal.","type":"boolean"},"show_in_announcement_post":{"description":"Whether a custom field should be shown in the list of fields as part of the announcement post when set.","type":"boolean"}},"required":["name","description","show_before_creation","show_before_closure","show_before_update"],"type":"object","description":"The JSON request body."}},"required":["id","requestBody"]},
    method: "put",
    pathTemplate: "/v1/custom_fields/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Custom Fields V1"],
    deprecated: true
  }],
  ["Custom_Fields_V1_Delete", {
    name: "Custom_Fields_V1_Delete",
    description: `[DEPRECATED] Delete a custom field
(Tags: Custom Fields V1)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"Unique identifier for the custom field","type":"string"}},"required":["id"]},
    method: "delete",
    pathTemplate: "/v1/custom_fields/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Custom Fields V1"],
    deprecated: true
  }],
  ["Utilities_V1_Identity", {
    name: "Utilities_V1_Identity",
    description: `Test if your API key is valid, and which roles it has.
(Tags: Utilities V1)`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/v1/identity",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Utilities V1"],
    deprecated: false
  }],
  ["Incident_Attachments_V1_List", {
    name: "Incident_Attachments_V1_List",
    description: `List all incident attachments for a given external resource or incident. You must provide either a specific incident ID or a specific external resource type and external ID.
(Tags: Incident Attachments V1)`,
    inputSchema: {"type":"object","properties":{"incident_id":{"description":"Incident that this attachment is against","type":"string"},"external_id":{"description":"ID of the resource in the external system","type":"string"},"resource_type":{"description":"E.g. PagerDuty: the external system that holds the resource","enum":["pager_duty_incident","opsgenie_alert","datadog_monitor_alert","github_pull_request","gitlab_merge_request","sentry_issue","jira_issue","jsm_alert","atlassian_statuspage_incident","zendesk_ticket","google_calendar_event","outlook_calendar_event","slack_file","scrubbed","statuspage_incident"],"type":"string"}}},
    method: "get",
    pathTemplate: "/v1/incident_attachments",
    executionParameters: [{"name":"incident_id","in":"query"},{"name":"external_id","in":"query"},{"name":"resource_type","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Incident Attachments V1"],
    deprecated: false
  }],
  ["Incident_Attachments_V1_Create", {
    name: "Incident_Attachments_V1_Create",
    description: `Attaches an external resource to an incident
(Tags: Incident Attachments V1)`,
    inputSchema: {"type":"object","properties":{"requestBody":{"properties":{"incident_id":{"description":"ID of the incident to add an attachment to","type":"string"},"resource":{"properties":{"external_id":{"description":"ID of the resource in the external system","type":"string"},"resource_type":{"description":"E.g. PagerDuty: the external system that holds the resource","enum":["pager_duty_incident","opsgenie_alert","datadog_monitor_alert","github_pull_request","gitlab_merge_request","sentry_issue","jira_issue","jsm_alert","atlassian_statuspage_incident","zendesk_ticket","google_calendar_event","outlook_calendar_event","slack_file","scrubbed","statuspage_incident"],"type":"string"}},"required":["id","permalink","external_id","title","resource_type","resource_type_label","created_at","updated_at"],"type":"object"}},"required":["incident_id","resource"],"type":"object","description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/v1/incident_attachments",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Incident Attachments V1"],
    deprecated: false
  }],
  ["Incident_Attachments_V1_Delete", {
    name: "Incident_Attachments_V1_Delete",
    description: `Unattaches an external resource from an incident
(Tags: Incident Attachments V1)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"Unique identifier of this incident membership","type":"string"}},"required":["id"]},
    method: "delete",
    pathTemplate: "/v1/incident_attachments/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Incident Attachments V1"],
    deprecated: false
  }],
  ["Incident_Memberships_V1_Create", {
    name: "Incident_Memberships_V1_Create",
    description: `Makes a user a member of a private incident
(Tags: Incident Memberships V1)`,
    inputSchema: {"type":"object","properties":{"requestBody":{"properties":{"incident_id":{"type":"string"},"user_id":{"type":"string"}},"required":["user_id","incident_id"],"type":"object","description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/v1/incident_memberships",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Incident Memberships V1"],
    deprecated: false
  }],
  ["Incident_Memberships_V1_Revoke", {
    name: "Incident_Memberships_V1_Revoke",
    description: `Revoke a user's membership of a private incident
(Tags: Incident Memberships V1)`,
    inputSchema: {"type":"object","properties":{"requestBody":{"properties":{"incident_id":{"description":"Revoke memberships to incident","type":"string"},"user_id":{"type":"string"}},"required":["user_id","incident_id"],"type":"object","description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/v1/incident_memberships/actions/revoke",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Incident Memberships V1"],
    deprecated: false
  }],
  ["Incident_Relationships_V1_List", {
    name: "Incident_Relationships_V1_List",
    description: `List related incidents for a specific incident.
(Tags: Incident Relationships V1)`,
    inputSchema: {"type":"object","properties":{"incident_id":{"description":"ID of the incident to find relationships for","type":"string"},"page_size":{"default":25,"description":"Integer number of records to return","format":"int64","maximum":250,"type":"number"},"after":{"description":"An record's ID. This endpoint will return a list of records after this ID in relation to the API response order.","type":"string"}},"required":["incident_id"]},
    method: "get",
    pathTemplate: "/v1/incident_relationships",
    executionParameters: [{"name":"incident_id","in":"query"},{"name":"page_size","in":"query"},{"name":"after","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Incident Relationships V1"],
    deprecated: false
  }],
  ["Incident_Roles_V1_List", {
    name: "Incident_Roles_V1_List",
    description: `[DEPRECATED] List all incident roles for an organisation.
(Tags: Incident Roles V1)`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/v1/incident_roles",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Incident Roles V1"],
    deprecated: true
  }],
  ["Incident_Roles_V1_Create", {
    name: "Incident_Roles_V1_Create",
    description: `[DEPRECATED] Create a new incident role
(Tags: Incident Roles V1)`,
    inputSchema: {"type":"object","properties":{"requestBody":{"properties":{"description":{"description":"Describes the purpose of the role","minLength":1,"type":"string"},"instructions":{"description":"Provided to whoever is nominated for the role. Note that this will be empty for the 'reporter' role.","type":"string"},"name":{"description":"Human readable name of the incident role","minLength":1,"type":"string"},"required":{"description":"DEPRECATED: this will always be false.","type":"boolean"},"shortform":{"description":"Short human readable name for Slack. Note that this will be empty for the 'reporter' role.","type":"string"}},"required":["name","shortform","description","instructions","required"],"type":"object","description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/v1/incident_roles",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Incident Roles V1"],
    deprecated: true
  }],
  ["Incident_Roles_V1_Show", {
    name: "Incident_Roles_V1_Show",
    description: `[DEPRECATED] Get a single incident role.
(Tags: Incident Roles V1)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"Unique identifier for the role","type":"string"}},"required":["id"]},
    method: "get",
    pathTemplate: "/v1/incident_roles/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Incident Roles V1"],
    deprecated: true
  }],
  ["Incident_Roles_V1_Update", {
    name: "Incident_Roles_V1_Update",
    description: `[DEPRECATED] Update an existing incident role
(Tags: Incident Roles V1)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"Unique identifier for the role","type":"string"},"requestBody":{"properties":{"description":{"description":"Describes the purpose of the role","minLength":1,"type":"string"},"instructions":{"description":"Provided to whoever is nominated for the role. Note that this will be empty for the 'reporter' role.","type":"string"},"name":{"description":"Human readable name of the incident role","minLength":1,"type":"string"},"required":{"description":"DEPRECATED: this will always be false.","type":"boolean"},"shortform":{"description":"Short human readable name for Slack. Note that this will be empty for the 'reporter' role.","type":"string"}},"required":["name","shortform","description","instructions"],"type":"object","description":"The JSON request body."}},"required":["id","requestBody"]},
    method: "put",
    pathTemplate: "/v1/incident_roles/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Incident Roles V1"],
    deprecated: true
  }],
  ["Incident_Roles_V1_Delete", {
    name: "Incident_Roles_V1_Delete",
    description: `[DEPRECATED] Removes an existing role
(Tags: Incident Roles V1)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"Unique identifier for the role","type":"string"}},"required":["id"]},
    method: "delete",
    pathTemplate: "/v1/incident_roles/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Incident Roles V1"],
    deprecated: true
  }],
  ["Incident_Statuses_V1_List", {
    name: "Incident_Statuses_V1_List",
    description: `List all incident statuses for an organisation.
(Tags: Incident Statuses V1)`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/v1/incident_statuses",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Incident Statuses V1"],
    deprecated: false
  }],
  ["Incident_Statuses_V1_Create", {
    name: "Incident_Statuses_V1_Create",
    description: `Create a new incident status
(Tags: Incident Statuses V1)`,
    inputSchema: {"type":"object","properties":{"requestBody":{"properties":{"category":{"description":"Whether the status should be considered 'live' (now renamed to active), 'learning' (now renamed to post-incident) or 'closed'. The triage and declined statuses cannot be created or modified.","enum":["live","learning","closed"],"type":"string"},"description":{"description":"Rich text description of the incident status","type":"string"},"name":{"description":"Unique name of this status","type":"string"}},"required":["name","description","category"],"type":"object","description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/v1/incident_statuses",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Incident Statuses V1"],
    deprecated: false
  }],
  ["Incident_Statuses_V1_Show", {
    name: "Incident_Statuses_V1_Show",
    description: `Get a single incident status.
(Tags: Incident Statuses V1)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"Unique ID of this incident status","type":"string"}},"required":["id"]},
    method: "get",
    pathTemplate: "/v1/incident_statuses/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Incident Statuses V1"],
    deprecated: false
  }],
  ["Incident_Statuses_V1_Update", {
    name: "Incident_Statuses_V1_Update",
    description: `Update an existing incident status
(Tags: Incident Statuses V1)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"Unique ID of this incident status","type":"string"},"requestBody":{"properties":{"description":{"description":"Rich text description of the incident status","type":"string"},"name":{"description":"Unique name of this status","type":"string"}},"required":["name","description"],"type":"object","description":"The JSON request body."}},"required":["id","requestBody"]},
    method: "put",
    pathTemplate: "/v1/incident_statuses/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Incident Statuses V1"],
    deprecated: false
  }],
  ["Incident_Statuses_V1_Delete", {
    name: "Incident_Statuses_V1_Delete",
    description: `Delete an incident status
(Tags: Incident Statuses V1)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"Unique ID of this incident status","type":"string"}},"required":["id"]},
    method: "delete",
    pathTemplate: "/v1/incident_statuses/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Incident Statuses V1"],
    deprecated: false
  }],
  ["Incident_Types_V1_List", {
    name: "Incident_Types_V1_List",
    description: `List all incident types for an organisation.
(Tags: Incident Types V1)`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/v1/incident_types",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Incident Types V1"],
    deprecated: false
  }],
  ["Incident_Types_V1_Show", {
    name: "Incident_Types_V1_Show",
    description: `Get a single incident type.
(Tags: Incident Types V1)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"Unique identifier for this Incident Type","type":"string"}},"required":["id"]},
    method: "get",
    pathTemplate: "/v1/incident_types/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Incident Types V1"],
    deprecated: false
  }],
  ["Incidents_V1_List", {
    name: "Incidents_V1_List",
    description: `[DEPRECATED] List all incidents for an organisation.
(Tags: Incidents V1)`,
    inputSchema: {"type":"object","properties":{"page_size":{"default":25,"description":"Integer number of records to return","format":"int64","maximum":500,"type":"number"},"after":{"description":"An record's ID. This endpoint will return a list of records after this ID in relation to the API response order.","type":"string"},"status":{"description":"Filter for incidents in these statuses","items":{"type":"string"},"type":"array"}}},
    method: "get",
    pathTemplate: "/v1/incidents",
    executionParameters: [{"name":"page_size","in":"query"},{"name":"after","in":"query"},{"name":"status","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Incidents V1"],
    deprecated: true
  }],
  ["Incidents_V1_Create", {
    name: "Incidents_V1_Create",
    description: `[DEPRECATED] Create a new incident.
(Tags: Incidents V1)`,
    inputSchema: {"type":"object","properties":{"requestBody":{"properties":{"custom_field_entries":{"description":"Set the incident's custom fields to these values","items":{"properties":{"custom_field_id":{"description":"ID of the custom field this entry is linked against","type":"string"},"values":{"description":"List of values to associate with this entry. Use an empty array to unset the value of the custom field.","items":{"properties":{"id":{"description":"Unique identifier for the custom field value","type":"string"},"value_catalog_entry_id":{"description":"ID of the catalog entry. You can also use an ExternalID or an Alias of the catalog entry.","type":"string"},"value_link":{"description":"If the custom field type is 'link', this will contain the value assigned.","type":"string"},"value_numeric":{"description":"If the custom field type is 'numeric', this will contain the value assigned.","type":"string"},"value_option_id":{"description":"ID of the custom field option","type":"string"},"value_text":{"description":"If the custom field type is 'text', this will contain the value assigned.","type":"string"},"value_timestamp":{"description":"Deprecated: please use incident timestamp values instead","type":"string"}},"type":"object"},"type":"array"}},"required":["custom_field_id","values"],"type":"object"},"type":"array"},"idempotency_key":{"description":"Unique string used to de-duplicate incident create requests","type":"string"},"incident_role_assignments":{"description":"Assign incident roles to these people","items":{"properties":{"assignee":{"properties":{"email":{"description":"The user's email address, matching the email on their Slack account","type":"string"},"id":{"description":"The incident.io ID of a user","type":"string"},"slack_user_id":{"description":"The ID of the user's Slack account.","type":"string"}},"type":"object"},"incident_role_id":{"description":"Unique ID of an incident role. Note that the 'reporter' role can only be assigned when creating an incident.","type":"string"}},"required":["incident_role_id","assignee"],"type":"object"},"type":"array"},"incident_type_id":{"description":"Incident type to create this incident as","type":"string"},"mode":{"description":"Whether the incident is real or test","enum":["real","test"],"type":"string"},"name":{"description":"Explanation of the incident","type":"string"},"severity_id":{"description":"Severity to create incident as","type":"string"},"slack_team_id":{"description":"ID of the Slack team / workspace. This is only required if you are using a Slack Enterprise Grid with multiple teams.","type":"string"},"source_message_channel_id":{"description":"Channel ID of the source message, if this incident was created from one","type":"string"},"source_message_timestamp":{"description":"Timestamp of the source message, if this incident was created from one","type":"string"},"status":{"description":"Current status of the incident","enum":["triage","investigating","fixing","monitoring","closed","declined"],"type":"string"},"summary":{"description":"Detailed description of the incident","type":"string"},"visibility":{"description":"Whether the incident should be open to anyone in your Slack workspace (public), or invite-only (private). For more information on Private Incidents see our [docs](https://docs.incident.io/incidents/sensitive-incidents).","enum":["public","private"],"type":"string"}},"required":["idempotency_key","visibility"],"type":"object","description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/v1/incidents",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Incidents V1"],
    deprecated: true
  }],
  ["Incidents_V1_Show", {
    name: "Incidents_V1_Show",
    description: `[DEPRECATED] Get a single incident.
(Tags: Incidents V1)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"Unique identifier for the incident","type":"string"}},"required":["id"]},
    method: "get",
    pathTemplate: "/v1/incidents/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Incidents V1"],
    deprecated: true
  }],
  ["IPAllowlists_V1_ShowIPAllowlist", {
    name: "IPAllowlists_V1_ShowIPAllowlist",
    description: `Show the IP allowlist for your organisation
(Tags: IPAllowlists V1)`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/v1/ip_allowlists",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["IPAllowlists V1"],
    deprecated: false
  }],
  ["IPAllowlists_V1_UpdateIPAllowlist", {
    name: "IPAllowlists_V1_UpdateIPAllowlist",
    description: `Update the IP allowlist for your organisation
(Tags: IPAllowlists V1)`,
    inputSchema: {"type":"object","properties":{"requestBody":{"properties":{"allowlist":{"description":"A list of IP addresses or CIDR prefixes to allow","items":{"properties":{"label":{"description":"A label to help identify this IP or prefix","type":"string"},"value":{"description":"An IP address or a CIDR IP prefix to allow","type":"string"}},"required":["value"],"type":"object"},"type":"array"},"enabled":{"description":"Whether this IP allowlist is enabled or not","type":"boolean"},"version":{"description":"The version of this IP allowlist","format":"int64","type":"number"}},"required":["version","enabled","allowlist"],"type":"object","description":"The JSON request body."}},"required":["requestBody"]},
    method: "put",
    pathTemplate: "/v1/ip_allowlists",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["IPAllowlists V1"],
    deprecated: false
  }],
  ["Utilities_V1_OpenAPI", {
    name: "Utilities_V1_OpenAPI",
    description: `[DEPRECATED] Get the OpenAPI (v2) definition.

**DEPRECATED**: Please use the OpenAPIV3 endpoint instead. The schema returned from this endpoint does not contain new options and endpoints added in 2025 and later.
(Tags: Utilities V1)`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/v1/openapi.json",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Utilities V1"],
    deprecated: true
  }],
  ["Utilities_V1_OpenAPIV3", {
    name: "Utilities_V1_OpenAPIV3",
    description: `Get the OpenAPI (v3) definition.
(Tags: Utilities V1)`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/v1/openapiV3.json",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Utilities V1"],
    deprecated: false
  }],
  ["Severities_V1_List", {
    name: "Severities_V1_List",
    description: `List all incident severities for an organisation.
(Tags: Severities V1)`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/v1/severities",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Severities V1"],
    deprecated: false
  }],
  ["Severities_V1_Create", {
    name: "Severities_V1_Create",
    description: `Create a new severity
(Tags: Severities V1)`,
    inputSchema: {"type":"object","properties":{"requestBody":{"properties":{"description":{"description":"Description of the severity","type":"string"},"name":{"description":"Human readable name of the severity","maxLength":50,"type":"string"},"rank":{"description":"Rank to help sort severities (lower numbers are less severe)","format":"int64","type":"number"}},"required":["name","description"],"type":"object","description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/v1/severities",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Severities V1"],
    deprecated: false
  }],
  ["Severities_V1_Show", {
    name: "Severities_V1_Show",
    description: `Get a single incident severity.
(Tags: Severities V1)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"Unique identifier of the severity","type":"string"}},"required":["id"]},
    method: "get",
    pathTemplate: "/v1/severities/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Severities V1"],
    deprecated: false
  }],
  ["Severities_V1_Update", {
    name: "Severities_V1_Update",
    description: `Update an existing severity
(Tags: Severities V1)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"Unique identifier of the severity","type":"string"},"requestBody":{"properties":{"description":{"description":"Description of the severity","type":"string"},"name":{"description":"Human readable name of the severity","maxLength":50,"type":"string"},"rank":{"description":"Rank to help sort severities (lower numbers are less severe)","format":"int64","type":"number"}},"required":["name","description"],"type":"object","description":"The JSON request body."}},"required":["id","requestBody"]},
    method: "put",
    pathTemplate: "/v1/severities/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Severities V1"],
    deprecated: false
  }],
  ["Severities_V1_Delete", {
    name: "Severities_V1_Delete",
    description: `Delete a severity
(Tags: Severities V1)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"Unique identifier of the severity","type":"string"}},"required":["id"]},
    method: "delete",
    pathTemplate: "/v1/severities/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Severities V1"],
    deprecated: false
  }],
  ["Status_Pages_V1_ListResponseIncidents", {
    name: "Status_Pages_V1_ListResponseIncidents",
    description: `List the linked Response incidents for a status page incident.
(Tags: Status Pages V1)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"ID of the status page","type":"string"},"incident_id":{"description":"ID of the status page incident","type":"string"}},"required":["id","incident_id"]},
    method: "get",
    pathTemplate: "/v1/status-pages/{id}/incidents/{incident_id}/response-incidents",
    executionParameters: [{"name":"id","in":"path"},{"name":"incident_id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Status Pages V1"],
    deprecated: false
  }],
  ["Actions_V2_List", {
    name: "Actions_V2_List",
    description: `List all actions for an organisation.
(Tags: Actions V2)`,
    inputSchema: {"type":"object","properties":{"incident_id":{"description":"Find actions related to this incident","type":"string"},"incident_mode":{"description":"Filter to actions from incidents of the given mode. If not set, only actions from `standard` and `retrospective` incidents are returned","enum":["standard","retrospective","test","tutorial","stream"],"type":"string"}}},
    method: "get",
    pathTemplate: "/v2/actions",
    executionParameters: [{"name":"incident_id","in":"query"},{"name":"incident_mode","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Actions V2"],
    deprecated: false
  }],
  ["Actions_V2_Show", {
    name: "Actions_V2_Show",
    description: `Get a single incident action.
(Tags: Actions V2)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"Unique identifier for the action","type":"string"}},"required":["id"]},
    method: "get",
    pathTemplate: "/v2/actions/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Actions V2"],
    deprecated: false
  }],
  ["Alert_Attributes_V2_List", {
    name: "Alert_Attributes_V2_List",
    description: `List alert attributes.
(Tags: Alert Attributes V2)`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/v2/alert_attributes",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Alert Attributes V2"],
    deprecated: false
  }],
  ["Alert_Attributes_V2_Create", {
    name: "Alert_Attributes_V2_Create",
    description: `Create a new alert attribute.
(Tags: Alert Attributes V2)`,
    inputSchema: {"type":"object","properties":{"requestBody":{"properties":{"array":{"description":"Whether this attribute is an array","type":"boolean"},"name":{"description":"Unique name of this attribute","type":"string"},"required":{"description":"Whether this attribute is required. If this field is not set, the existing setting will be preserved.","type":"boolean"},"type":{"description":"Engine resource name for this attribute","type":"string"}},"required":["name","type","array"],"type":"object","description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/v2/alert_attributes",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Alert Attributes V2"],
    deprecated: false
  }],
  ["Alert_Attributes_V2_Show", {
    name: "Alert_Attributes_V2_Show",
    description: `Show an alert attribute.
(Tags: Alert Attributes V2)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"The ID of this attribute","type":"string"}},"required":["id"]},
    method: "get",
    pathTemplate: "/v2/alert_attributes/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Alert Attributes V2"],
    deprecated: false
  }],
  ["Alert_Attributes_V2_Update", {
    name: "Alert_Attributes_V2_Update",
    description: `Update an alert attribute.
(Tags: Alert Attributes V2)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"The ID of this attribute","type":"string"},"requestBody":{"properties":{"array":{"description":"Whether this attribute is an array","type":"boolean"},"name":{"description":"Unique name of this attribute","type":"string"},"required":{"description":"Whether this attribute is required. If this field is not set, the existing setting will be preserved.","type":"boolean"},"type":{"description":"Engine resource name for this attribute","type":"string"}},"required":["name","type","array"],"type":"object","description":"The JSON request body."}},"required":["id","requestBody"]},
    method: "put",
    pathTemplate: "/v2/alert_attributes/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Alert Attributes V2"],
    deprecated: false
  }],
  ["Alert_Attributes_V2_Destroy", {
    name: "Alert_Attributes_V2_Destroy",
    description: `Destroy an alert attribute.
(Tags: Alert Attributes V2)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"The ID of this attribute","type":"string"}},"required":["id"]},
    method: "delete",
    pathTemplate: "/v2/alert_attributes/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Alert Attributes V2"],
    deprecated: false
  }],
  ["Alert_Events_V2_CreateHTTP", {
    name: "Alert_Events_V2_CreateHTTP",
    description: `Create an alert event using an HTTP source.
(Tags: Alert Events V2)`,
    inputSchema: {"type":"object","properties":{"token":{"description":"Token used to authenticate the request, generated when configuring the alert source. Will be consumed via a URL query string parameter","type":"string"},"alert_source_config_id":{"description":"Which alert source config produced this alert","type":"string"},"requestBody":{"properties":{"deduplication_key":{"description":"A deduplication key which uniquely references this alert from your alert source. For newly created HTTP sources, this field is required.\nIf you send an event with the same deduplication_key multiple times, only one alert will be created in incident.io for this alert source config.\nYou can filter on this field to find the alert created by an event you've sent us.","type":"string"},"description":{"description":"Description that optionally adds more detail to title. Supports markdown.","type":"string"},"metadata":{"additionalProperties":true,"description":"Any additional metadata that you've configured your alert source to parse","type":"object"},"source_url":{"description":"If applicable, a link to the alert in the upstream system","type":"string"},"status":{"description":"Current status of this alert","enum":["firing","resolved"],"type":"string"},"title":{"description":"The title of the alert, parsed from the alert payload according to the alert source configuration","type":"string"}},"required":["title","status"],"type":"object","description":"The JSON request body."}},"required":["alert_source_config_id","requestBody"]},
    method: "post",
    pathTemplate: "/v2/alert_events/http/{alert_source_config_id}",
    executionParameters: [{"name":"token","in":"query"},{"name":"alert_source_config_id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Alert Events V2"],
    deprecated: false
  }],
  ["Alert_Routes_V2_List", {
    name: "Alert_Routes_V2_List",
    description: `List all alert routes in your account.
(Tags: Alert Routes V2)`,
    inputSchema: {"type":"object","properties":{"page_size":{"default":25,"description":"Number of alert routes to return per page","format":"int64","maximum":50,"minimum":1,"type":"number"},"after":{"description":"The ID of the last alert route on the previous page","type":"string"}},"required":["page_size"]},
    method: "get",
    pathTemplate: "/v2/alert_routes",
    executionParameters: [{"name":"page_size","in":"query"},{"name":"after","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Alert Routes V2"],
    deprecated: false
  }],
  ["Alert_Routes_V2_Create", {
    name: "Alert_Routes_V2_Create",
    description: `Create a new alert route in your account.
(Tags: Alert Routes V2)`,
    inputSchema: {"type":"object","properties":{"requestBody":{"properties":{"alert_sources":{"description":"Which alert sources should this alert route match?","items":{"properties":{"alert_source_id":{"description":"The alert source ID that will match for the route","type":"string"},"condition_groups":{"description":"What conditions should alerts from this source meet to be included in this alert route?","items":{"properties":{"conditions":{"description":"All conditions in this list must be satisfied for the group to be satisfied","items":{"properties":{"operation":{"description":"The name of the operation on the subject","type":"string"},"param_bindings":{"description":"List of parameter bindings","items":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"},"type":"array"},"subject":{"description":"The reference of the subject in the trigger scope","type":"string"}},"required":["subject","operation","param_bindings"],"type":"object"},"type":"array"}},"required":["conditions"],"type":"object"},"type":"array"}},"required":["alert_source_id","condition_groups"],"type":"object"},"type":"array"},"channel_config":{"description":"The channel configuration for this alert route","items":{"properties":{"condition_groups":{"description":"The conditions that must be met for this channel config to be used","items":{"properties":{"conditions":{"description":"All conditions in this list must be satisfied for the group to be satisfied","items":{"properties":{"operation":{"description":"The name of the operation on the subject","type":"string"},"param_bindings":{"description":"List of parameter bindings","items":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"},"type":"array"},"subject":{"description":"The reference of the subject in the trigger scope","type":"string"}},"required":["subject","operation","param_bindings"],"type":"object"},"type":"array"}},"required":["conditions"],"type":"object"},"type":"array"},"ms_teams_targets":{"properties":{"binding":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"},"channel_visibility":{"description":"The visibility of the channel","type":"string"}},"required":["binding","channel_visibility"],"type":"object"},"slack_targets":{"properties":{"binding":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"},"channel_visibility":{"description":"The visibility of the channel","type":"string"}},"required":["binding","channel_visibility"],"type":"object"}},"required":["condition_groups"],"type":"object"},"type":"array"},"condition_groups":{"description":"What condition groups must be true for this alert route to fire?","items":{"properties":{"conditions":{"description":"All conditions in this list must be satisfied for the group to be satisfied","items":{"properties":{"operation":{"description":"The name of the operation on the subject","type":"string"},"param_bindings":{"description":"List of parameter bindings","items":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"},"type":"array"},"subject":{"description":"The reference of the subject in the trigger scope","type":"string"}},"required":["subject","operation","param_bindings"],"type":"object"},"type":"array"}},"required":["conditions"],"type":"object"},"type":"array"},"created_at":{"description":"The time of creation of this alert route","format":"date-time","type":"string"},"enabled":{"description":"Whether this alert route is enabled or not","type":"boolean"},"escalation_config":{"properties":{"auto_cancel_escalations":{"description":"Should we auto cancel escalations when all alerts are resolved?","type":"boolean"},"escalation_targets":{"description":"Targets for escalation","items":{"properties":{"escalation_paths":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"},"users":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"}},"type":"object"},"type":"array"}},"required":["auto_cancel_escalations","escalation_targets"],"type":"object"},"expressions":{"description":"The expressions used in this template","items":{"properties":{"else_branch":{"properties":{"result":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"}},"required":["result"],"type":"object"},"label":{"description":"The human readable label of the expression","type":"string"},"operations":{"items":{"properties":{"branches":{"properties":{"branches":{"description":"The branches to apply for this operation","items":{"properties":{"condition_groups":{"description":"When one of these condition groups are satisfied, this branch will be evaluated","items":{"properties":{"conditions":{"description":"All conditions in this list must be satisfied for the group to be satisfied","items":{"properties":{"operation":{"description":"The name of the operation on the subject","type":"string"},"param_bindings":{"description":"List of parameter bindings","items":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"},"type":"array"},"subject":{"description":"The reference of the subject in the trigger scope","type":"string"}},"required":["subject","operation","param_bindings"],"type":"object"},"type":"array"}},"required":["conditions"],"type":"object"},"type":"array"},"result":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"}},"required":["condition_groups","result"],"type":"object"},"type":"array"},"returns":{"properties":{"array":{"description":"Whether the return value should be single or multi-value","type":"boolean"},"type":{"description":"Expected return type of this expression (what to try casting the result to)","type":"string"}},"required":["type","array"],"type":"object"}},"required":["branches","returns"],"type":"object"},"concatenate":{"properties":{"reference":{"description":"The reference that you want to concatenate with","type":"string"}},"required":["reference"],"type":"object"},"filter":{"properties":{"condition_groups":{"description":"The condition groups to apply in this filter. Only one group needs to be satisfied for the filter to pass.","items":{"properties":{"conditions":{"description":"All conditions in this list must be satisfied for the group to be satisfied","items":{"properties":{"operation":{"description":"The name of the operation on the subject","type":"string"},"param_bindings":{"description":"List of parameter bindings","items":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"},"type":"array"},"subject":{"description":"The reference of the subject in the trigger scope","type":"string"}},"required":["subject","operation","param_bindings"],"type":"object"},"type":"array"}},"required":["conditions"],"type":"object"},"type":"array"}},"required":["condition_groups"],"type":"object"},"navigate":{"properties":{"reference":{"description":"The reference that you want to navigate to","type":"string"}},"required":["reference"],"type":"object"},"operation_type":{"description":"The type of the operation","enum":["navigate","filter","concatenate","count","min","max","sum","random","first","parse","branches"],"type":"string"},"parse":{"properties":{"returns":{"properties":{"array":{"description":"Whether the return value should be single or multi-value","type":"boolean"},"type":{"description":"Expected return type of this expression (what to try casting the result to)","type":"string"}},"required":["type","array"],"type":"object"},"source":{"description":"Source expression that is evaluated to a result","type":"string"}},"required":["source","returns"],"type":"object"}},"required":["operation_type"],"type":"object"},"type":"array"},"reference":{"description":"A short ID that can be used to reference the expression","type":"string"},"root_reference":{"description":"The root reference for this expression (i.e. where the expression starts)","type":"string"}},"required":["label","reference","root_reference","operations"],"type":"object"},"type":"array"},"incident_config":{"properties":{"auto_decline_enabled":{"description":"Should triage incidents be declined when alerts are resolved?","type":"boolean"},"auto_relate_grouped_alerts":{"description":"Should grouped alerts automatically be related to active incidents without confirmation?","type":"boolean"},"condition_groups":{"description":"What condition groups must be true for this alert route to create an incident?","items":{"properties":{"conditions":{"description":"All conditions in this list must be satisfied for the group to be satisfied","items":{"properties":{"operation":{"description":"The name of the operation on the subject","type":"string"},"param_bindings":{"description":"List of parameter bindings","items":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"},"type":"array"},"subject":{"description":"The reference of the subject in the trigger scope","type":"string"}},"required":["subject","operation","param_bindings"],"type":"object"},"type":"array"}},"required":["conditions"],"type":"object"},"type":"array"},"defer_time_seconds":{"description":"How long should the escalation defer time be?","format":"int32","type":"number"},"enabled":{"description":"Whether incident creation is enabled for this alert route","type":"boolean"},"grouping_keys":{"description":"Which attributes should this alert route use to group alerts?","items":{"properties":{"reference":{"description":"A reference to a property of the alert to group on","type":"string"}},"required":["reference"],"type":"object"},"type":"array"},"grouping_window_seconds":{"description":"How large should the grouping window be?","format":"int32","type":"number"}},"required":["auto_decline_enabled","enabled","condition_groups","grouping_keys","grouping_window_seconds","defer_time_seconds"],"type":"object"},"incident_template":{"properties":{"custom_fields":{"description":"Custom fields configuration","items":{"properties":{"binding":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"},"custom_field_id":{"description":"ID of the custom field","type":"string"},"merge_strategy":{"description":"The strategy to use when multiple alerts match this route","enum":["first-wins","last-wins","append"],"type":"string"}},"required":["custom_field_id","binding","merge_strategy"],"type":"object"},"type":"array"},"incident_mode":{"properties":{"binding":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"}},"type":"object"},"incident_type":{"properties":{"binding":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"}},"type":"object"},"name":{"properties":{"autogenerated":{"description":"Whether this attribute is autogenerated using AI or not","type":"boolean"},"binding":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"}},"type":"object"},"severity":{"properties":{"binding":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"},"merge_strategy":{"description":"Strategy for merging severity when multiple alerts create/update the same incident","enum":["first-wins","max"],"type":"string"}},"required":["merge_strategy"],"type":"object"},"start_in_triage":{"properties":{"binding":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"}},"type":"object"},"summary":{"properties":{"autogenerated":{"description":"Whether this attribute is autogenerated using AI or not","type":"boolean"},"binding":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"}},"type":"object"},"workspace":{"properties":{"binding":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"}},"type":"object"}},"required":["name"],"type":"object"},"is_private":{"description":"Whether this alert route is private. Private alert routes will only create private incidents from alerts.","type":"boolean"},"message_template":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"},"name":{"description":"The name of this alert route config, for the user's reference","type":"string"},"owning_team_ids":{"description":"IDs of teams that own this alert route","items":{"type":"string"},"type":"array"},"updated_at":{"description":"The time of last update of this alert route","format":"date-time","type":"string"},"version":{"description":"The version of this alert route config","format":"int64","type":"number"}},"required":["name","condition_groups","expressions","is_private","enabled","escalation_config","incident_config","incident_template","alert_sources","channel_config","version"],"type":"object","description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/v2/alert_routes",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Alert Routes V2"],
    deprecated: false
  }],
  ["Alert_Routes_V2_Show", {
    name: "Alert_Routes_V2_Show",
    description: `Load details about a specific alert route in your account.
(Tags: Alert Routes V2)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"Unique identifier of the alert route","type":"string"}},"required":["id"]},
    method: "get",
    pathTemplate: "/v2/alert_routes/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Alert Routes V2"],
    deprecated: false
  }],
  ["Alert_Routes_V2_Update", {
    name: "Alert_Routes_V2_Update",
    description: `Update an existing alert route in your account.
(Tags: Alert Routes V2)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"Unique identifier of the alert route","type":"string"},"requestBody":{"properties":{"alert_sources":{"description":"Which alert sources should this alert route match?","items":{"properties":{"alert_source_id":{"description":"The alert source ID that will match for the route","type":"string"},"condition_groups":{"description":"What conditions should alerts from this source meet to be included in this alert route?","items":{"properties":{"conditions":{"description":"All conditions in this list must be satisfied for the group to be satisfied","items":{"properties":{"operation":{"description":"The name of the operation on the subject","type":"string"},"param_bindings":{"description":"List of parameter bindings","items":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"},"type":"array"},"subject":{"description":"The reference of the subject in the trigger scope","type":"string"}},"required":["subject","operation","param_bindings"],"type":"object"},"type":"array"}},"required":["conditions"],"type":"object"},"type":"array"}},"required":["alert_source_id","condition_groups"],"type":"object"},"type":"array"},"channel_config":{"description":"The channel configuration for this alert route","items":{"properties":{"condition_groups":{"description":"The conditions that must be met for this channel config to be used","items":{"properties":{"conditions":{"description":"All conditions in this list must be satisfied for the group to be satisfied","items":{"properties":{"operation":{"description":"The name of the operation on the subject","type":"string"},"param_bindings":{"description":"List of parameter bindings","items":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"},"type":"array"},"subject":{"description":"The reference of the subject in the trigger scope","type":"string"}},"required":["subject","operation","param_bindings"],"type":"object"},"type":"array"}},"required":["conditions"],"type":"object"},"type":"array"},"ms_teams_targets":{"properties":{"binding":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"},"channel_visibility":{"description":"The visibility of the channel","type":"string"}},"required":["binding","channel_visibility"],"type":"object"},"slack_targets":{"properties":{"binding":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"},"channel_visibility":{"description":"The visibility of the channel","type":"string"}},"required":["binding","channel_visibility"],"type":"object"}},"required":["condition_groups"],"type":"object"},"type":"array"},"condition_groups":{"description":"What condition groups must be true for this alert route to fire?","items":{"properties":{"conditions":{"description":"All conditions in this list must be satisfied for the group to be satisfied","items":{"properties":{"operation":{"description":"The name of the operation on the subject","type":"string"},"param_bindings":{"description":"List of parameter bindings","items":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"},"type":"array"},"subject":{"description":"The reference of the subject in the trigger scope","type":"string"}},"required":["subject","operation","param_bindings"],"type":"object"},"type":"array"}},"required":["conditions"],"type":"object"},"type":"array"},"created_at":{"description":"The time of creation of this alert route","format":"date-time","type":"string"},"enabled":{"description":"Whether this alert route is enabled or not","type":"boolean"},"escalation_config":{"properties":{"auto_cancel_escalations":{"description":"Should we auto cancel escalations when all alerts are resolved?","type":"boolean"},"escalation_targets":{"description":"Targets for escalation","items":{"properties":{"escalation_paths":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"},"users":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"}},"type":"object"},"type":"array"}},"required":["auto_cancel_escalations","escalation_targets"],"type":"object"},"expressions":{"description":"The expressions used in this template","items":{"properties":{"else_branch":{"properties":{"result":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"}},"required":["result"],"type":"object"},"label":{"description":"The human readable label of the expression","type":"string"},"operations":{"items":{"properties":{"branches":{"properties":{"branches":{"description":"The branches to apply for this operation","items":{"properties":{"condition_groups":{"description":"When one of these condition groups are satisfied, this branch will be evaluated","items":{"properties":{"conditions":{"description":"All conditions in this list must be satisfied for the group to be satisfied","items":{"properties":{"operation":{"description":"The name of the operation on the subject","type":"string"},"param_bindings":{"description":"List of parameter bindings","items":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"},"type":"array"},"subject":{"description":"The reference of the subject in the trigger scope","type":"string"}},"required":["subject","operation","param_bindings"],"type":"object"},"type":"array"}},"required":["conditions"],"type":"object"},"type":"array"},"result":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"}},"required":["condition_groups","result"],"type":"object"},"type":"array"},"returns":{"properties":{"array":{"description":"Whether the return value should be single or multi-value","type":"boolean"},"type":{"description":"Expected return type of this expression (what to try casting the result to)","type":"string"}},"required":["type","array"],"type":"object"}},"required":["branches","returns"],"type":"object"},"concatenate":{"properties":{"reference":{"description":"The reference that you want to concatenate with","type":"string"}},"required":["reference"],"type":"object"},"filter":{"properties":{"condition_groups":{"description":"The condition groups to apply in this filter. Only one group needs to be satisfied for the filter to pass.","items":{"properties":{"conditions":{"description":"All conditions in this list must be satisfied for the group to be satisfied","items":{"properties":{"operation":{"description":"The name of the operation on the subject","type":"string"},"param_bindings":{"description":"List of parameter bindings","items":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"},"type":"array"},"subject":{"description":"The reference of the subject in the trigger scope","type":"string"}},"required":["subject","operation","param_bindings"],"type":"object"},"type":"array"}},"required":["conditions"],"type":"object"},"type":"array"}},"required":["condition_groups"],"type":"object"},"navigate":{"properties":{"reference":{"description":"The reference that you want to navigate to","type":"string"}},"required":["reference"],"type":"object"},"operation_type":{"description":"The type of the operation","enum":["navigate","filter","concatenate","count","min","max","sum","random","first","parse","branches"],"type":"string"},"parse":{"properties":{"returns":{"properties":{"array":{"description":"Whether the return value should be single or multi-value","type":"boolean"},"type":{"description":"Expected return type of this expression (what to try casting the result to)","type":"string"}},"required":["type","array"],"type":"object"},"source":{"description":"Source expression that is evaluated to a result","type":"string"}},"required":["source","returns"],"type":"object"}},"required":["operation_type"],"type":"object"},"type":"array"},"reference":{"description":"A short ID that can be used to reference the expression","type":"string"},"root_reference":{"description":"The root reference for this expression (i.e. where the expression starts)","type":"string"}},"required":["label","reference","root_reference","operations"],"type":"object"},"type":"array"},"incident_config":{"properties":{"auto_decline_enabled":{"description":"Should triage incidents be declined when alerts are resolved?","type":"boolean"},"auto_relate_grouped_alerts":{"description":"Should grouped alerts automatically be related to active incidents without confirmation?","type":"boolean"},"condition_groups":{"description":"What condition groups must be true for this alert route to create an incident?","items":{"properties":{"conditions":{"description":"All conditions in this list must be satisfied for the group to be satisfied","items":{"properties":{"operation":{"description":"The name of the operation on the subject","type":"string"},"param_bindings":{"description":"List of parameter bindings","items":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"},"type":"array"},"subject":{"description":"The reference of the subject in the trigger scope","type":"string"}},"required":["subject","operation","param_bindings"],"type":"object"},"type":"array"}},"required":["conditions"],"type":"object"},"type":"array"},"defer_time_seconds":{"description":"How long should the escalation defer time be?","format":"int32","type":"number"},"enabled":{"description":"Whether incident creation is enabled for this alert route","type":"boolean"},"grouping_keys":{"description":"Which attributes should this alert route use to group alerts?","items":{"properties":{"reference":{"description":"A reference to a property of the alert to group on","type":"string"}},"required":["reference"],"type":"object"},"type":"array"},"grouping_window_seconds":{"description":"How large should the grouping window be?","format":"int32","type":"number"}},"required":["auto_decline_enabled","enabled","condition_groups","grouping_keys","grouping_window_seconds","defer_time_seconds"],"type":"object"},"incident_template":{"properties":{"custom_fields":{"description":"Custom fields configuration","items":{"properties":{"binding":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"},"custom_field_id":{"description":"ID of the custom field","type":"string"},"merge_strategy":{"description":"The strategy to use when multiple alerts match this route","enum":["first-wins","last-wins","append"],"type":"string"}},"required":["custom_field_id","binding","merge_strategy"],"type":"object"},"type":"array"},"incident_mode":{"properties":{"binding":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"}},"type":"object"},"incident_type":{"properties":{"binding":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"}},"type":"object"},"name":{"properties":{"autogenerated":{"description":"Whether this attribute is autogenerated using AI or not","type":"boolean"},"binding":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"}},"type":"object"},"severity":{"properties":{"binding":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"},"merge_strategy":{"description":"Strategy for merging severity when multiple alerts create/update the same incident","enum":["first-wins","max"],"type":"string"}},"required":["merge_strategy"],"type":"object"},"start_in_triage":{"properties":{"binding":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"}},"type":"object"},"summary":{"properties":{"autogenerated":{"description":"Whether this attribute is autogenerated using AI or not","type":"boolean"},"binding":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"}},"type":"object"},"workspace":{"properties":{"binding":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"}},"type":"object"}},"required":["name"],"type":"object"},"is_private":{"description":"Whether this alert route is private. Private alert routes will only create private incidents from alerts.","type":"boolean"},"message_template":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"},"name":{"description":"The name of this alert route config, for the user's reference","type":"string"},"owning_team_ids":{"description":"IDs of teams that own this alert route","items":{"type":"string"},"type":"array"},"updated_at":{"description":"The time of last update of this alert route","format":"date-time","type":"string"},"version":{"description":"The version of this alert route config","format":"int64","type":"number"}},"required":["name","condition_groups","expressions","is_private","enabled","escalation_config","incident_config","incident_template","alert_sources","channel_config","version"],"type":"object","description":"The JSON request body."}},"required":["id","requestBody"]},
    method: "put",
    pathTemplate: "/v2/alert_routes/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Alert Routes V2"],
    deprecated: false
  }],
  ["Alert_Routes_V2_Delete", {
    name: "Alert_Routes_V2_Delete",
    description: `Delete an existing alert route in your account.
(Tags: Alert Routes V2)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"Unique identifier of the alert route","type":"string"}},"required":["id"]},
    method: "delete",
    pathTemplate: "/v2/alert_routes/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Alert Routes V2"],
    deprecated: false
  }],
  ["Alert_Sources_V2_List", {
    name: "Alert_Sources_V2_List",
    description: `List all alert sources in your account.
(Tags: Alert Sources V2)`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/v2/alert_sources",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Alert Sources V2"],
    deprecated: false
  }],
  ["Alert_Sources_V2_Create", {
    name: "Alert_Sources_V2_Create",
    description: `Create a new alert source in your account.
(Tags: Alert Sources V2)`,
    inputSchema: {"type":"object","properties":{"requestBody":{"properties":{"http_custom_options":{"properties":{"deduplication_key_path":{"description":"JSON path to extract the deduplication key from the payload","type":"string"},"transform_expression":{"description":"JavaScript expression that returns an object with all alert fields","type":"string"}},"required":["transform_expression","deduplication_key_path"],"type":"object"},"jira_options":{"properties":{"project_ids":{"description":"Which projects in Jira should this alert source watch for new issues? IDs can either be IDs of the projects in Jira, or ID of catalog entries in the 'Jira Project' catalog type.","items":{"type":"string"},"type":"array"}},"required":["project_ids"],"type":"object"},"name":{"description":"Unique name of the alert source","type":"string"},"owning_team_ids":{"description":"IDs of teams that own this alert source","items":{"type":"string"},"type":"array"},"source_type":{"description":"Type of alert source","enum":["alertmanager","app_optics","azure_monitor","bugsnag","checkly","chronosphere","cloudwatch","cloudflare","coralogix","cronitor","crowdstrike_falcon","datadog","dynatrace","elasticsearch","email","expel","github_issue","google_cloud","grafana","http","http_custom","honeycomb","incoming_calls","jira","jsm","monte_carlo","nagios","new_relic","opsgenie","prtg","pager_duty","panther","pingdom","runscope","sns","sentry","sentry_metric","splunk","status_cake","status_page_views","sumo_logic","uptime","zendesk"],"type":"string"},"template":{"properties":{"attributes":{"description":"Attributes to set on alerts coming from this source, with a binding describing how to set them.","items":{"properties":{"alert_attribute_id":{"description":"ID of the alert attribute to set with this binding","type":"string"},"binding":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"merge_strategy":{"description":"Merge strategy for this attribute when alert updates","enum":["first_wins","last_wins","append","max","min"],"type":"string"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"}},"required":["alert_attribute_id","binding"],"type":"object"},"type":"array"},"description":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"expressions":{"description":"Expressions available for use in bindings within this template","items":{"properties":{"else_branch":{"properties":{"result":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"}},"required":["result"],"type":"object"},"label":{"description":"The human readable label of the expression","type":"string"},"operations":{"items":{"properties":{"branches":{"properties":{"branches":{"description":"The branches to apply for this operation","items":{"properties":{"condition_groups":{"description":"When one of these condition groups are satisfied, this branch will be evaluated","items":{"properties":{"conditions":{"description":"All conditions in this list must be satisfied for the group to be satisfied","items":{"properties":{"operation":{"description":"The name of the operation on the subject","type":"string"},"param_bindings":{"description":"List of parameter bindings","items":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"},"type":"array"},"subject":{"description":"The reference of the subject in the trigger scope","type":"string"}},"required":["subject","operation","param_bindings"],"type":"object"},"type":"array"}},"required":["conditions"],"type":"object"},"type":"array"},"result":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"}},"required":["condition_groups","result"],"type":"object"},"type":"array"},"returns":{"properties":{"array":{"description":"Whether the return value should be single or multi-value","type":"boolean"},"type":{"description":"Expected return type of this expression (what to try casting the result to)","type":"string"}},"required":["type","array"],"type":"object"}},"required":["branches","returns"],"type":"object"},"concatenate":{"properties":{"reference":{"description":"The reference that you want to concatenate with","type":"string"}},"required":["reference"],"type":"object"},"filter":{"properties":{"condition_groups":{"description":"The condition groups to apply in this filter. Only one group needs to be satisfied for the filter to pass.","items":{"properties":{"conditions":{"description":"All conditions in this list must be satisfied for the group to be satisfied","items":{"properties":{"operation":{"description":"The name of the operation on the subject","type":"string"},"param_bindings":{"description":"List of parameter bindings","items":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"},"type":"array"},"subject":{"description":"The reference of the subject in the trigger scope","type":"string"}},"required":["subject","operation","param_bindings"],"type":"object"},"type":"array"}},"required":["conditions"],"type":"object"},"type":"array"}},"required":["condition_groups"],"type":"object"},"navigate":{"properties":{"reference":{"description":"The reference that you want to navigate to","type":"string"}},"required":["reference"],"type":"object"},"operation_type":{"description":"The type of the operation","enum":["navigate","filter","concatenate","count","min","max","sum","random","first","parse","branches"],"type":"string"},"parse":{"properties":{"returns":{"properties":{"array":{"description":"Whether the return value should be single or multi-value","type":"boolean"},"type":{"description":"Expected return type of this expression (what to try casting the result to)","type":"string"}},"required":["type","array"],"type":"object"},"source":{"description":"Source expression that is evaluated to a result","type":"string"}},"required":["source","returns"],"type":"object"}},"required":["operation_type"],"type":"object"},"type":"array"},"reference":{"description":"A short ID that can be used to reference the expression","type":"string"},"root_reference":{"description":"The root reference for this expression (i.e. where the expression starts)","type":"string"}},"required":["label","reference","root_reference","operations"],"type":"object"},"type":"array"},"is_private":{"description":"Whether or not alerts produced by this source should be private","type":"boolean"},"title":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"visible_to_teams":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"}},"required":["expressions","title","description","attributes"],"type":"object"}},"required":["name","source_type","template"],"type":"object","description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/v2/alert_sources",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Alert Sources V2"],
    deprecated: false
  }],
  ["Alert_Sources_V2_Show", {
    name: "Alert_Sources_V2_Show",
    description: `Load details about a specific alert source in your account.
(Tags: Alert Sources V2)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"The ID of this alert source","type":"string"}},"required":["id"]},
    method: "get",
    pathTemplate: "/v2/alert_sources/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Alert Sources V2"],
    deprecated: false
  }],
  ["Alert_Sources_V2_Update", {
    name: "Alert_Sources_V2_Update",
    description: `Update an existing alert source in your account.
(Tags: Alert Sources V2)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"The ID of this alert source","type":"string"},"requestBody":{"properties":{"http_custom_options":{"properties":{"deduplication_key_path":{"description":"JSON path to extract the deduplication key from the payload","type":"string"},"transform_expression":{"description":"JavaScript expression that returns an object with all alert fields","type":"string"}},"required":["transform_expression","deduplication_key_path"],"type":"object"},"jira_options":{"properties":{"project_ids":{"description":"Which projects in Jira should this alert source watch for new issues? IDs can either be IDs of the projects in Jira, or ID of catalog entries in the 'Jira Project' catalog type.","items":{"type":"string"},"type":"array"}},"required":["project_ids"],"type":"object"},"name":{"description":"Unique name of the alert source","type":"string"},"owning_team_ids":{"description":"IDs of teams that own this alert source","items":{"type":"string"},"type":"array"},"template":{"properties":{"attributes":{"description":"Attributes to set on alerts coming from this source, with a binding describing how to set them.","items":{"properties":{"alert_attribute_id":{"description":"ID of the alert attribute to set with this binding","type":"string"},"binding":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"merge_strategy":{"description":"Merge strategy for this attribute when alert updates","enum":["first_wins","last_wins","append","max","min"],"type":"string"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"}},"required":["alert_attribute_id","binding"],"type":"object"},"type":"array"},"description":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"expressions":{"description":"Expressions available for use in bindings within this template","items":{"properties":{"else_branch":{"properties":{"result":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"}},"required":["result"],"type":"object"},"label":{"description":"The human readable label of the expression","type":"string"},"operations":{"items":{"properties":{"branches":{"properties":{"branches":{"description":"The branches to apply for this operation","items":{"properties":{"condition_groups":{"description":"When one of these condition groups are satisfied, this branch will be evaluated","items":{"properties":{"conditions":{"description":"All conditions in this list must be satisfied for the group to be satisfied","items":{"properties":{"operation":{"description":"The name of the operation on the subject","type":"string"},"param_bindings":{"description":"List of parameter bindings","items":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"},"type":"array"},"subject":{"description":"The reference of the subject in the trigger scope","type":"string"}},"required":["subject","operation","param_bindings"],"type":"object"},"type":"array"}},"required":["conditions"],"type":"object"},"type":"array"},"result":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"}},"required":["condition_groups","result"],"type":"object"},"type":"array"},"returns":{"properties":{"array":{"description":"Whether the return value should be single or multi-value","type":"boolean"},"type":{"description":"Expected return type of this expression (what to try casting the result to)","type":"string"}},"required":["type","array"],"type":"object"}},"required":["branches","returns"],"type":"object"},"concatenate":{"properties":{"reference":{"description":"The reference that you want to concatenate with","type":"string"}},"required":["reference"],"type":"object"},"filter":{"properties":{"condition_groups":{"description":"The condition groups to apply in this filter. Only one group needs to be satisfied for the filter to pass.","items":{"properties":{"conditions":{"description":"All conditions in this list must be satisfied for the group to be satisfied","items":{"properties":{"operation":{"description":"The name of the operation on the subject","type":"string"},"param_bindings":{"description":"List of parameter bindings","items":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"},"type":"array"},"subject":{"description":"The reference of the subject in the trigger scope","type":"string"}},"required":["subject","operation","param_bindings"],"type":"object"},"type":"array"}},"required":["conditions"],"type":"object"},"type":"array"}},"required":["condition_groups"],"type":"object"},"navigate":{"properties":{"reference":{"description":"The reference that you want to navigate to","type":"string"}},"required":["reference"],"type":"object"},"operation_type":{"description":"The type of the operation","enum":["navigate","filter","concatenate","count","min","max","sum","random","first","parse","branches"],"type":"string"},"parse":{"properties":{"returns":{"properties":{"array":{"description":"Whether the return value should be single or multi-value","type":"boolean"},"type":{"description":"Expected return type of this expression (what to try casting the result to)","type":"string"}},"required":["type","array"],"type":"object"},"source":{"description":"Source expression that is evaluated to a result","type":"string"}},"required":["source","returns"],"type":"object"}},"required":["operation_type"],"type":"object"},"type":"array"},"reference":{"description":"A short ID that can be used to reference the expression","type":"string"},"root_reference":{"description":"The root reference for this expression (i.e. where the expression starts)","type":"string"}},"required":["label","reference","root_reference","operations"],"type":"object"},"type":"array"},"is_private":{"description":"Whether or not alerts produced by this source should be private","type":"boolean"},"title":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"visible_to_teams":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"}},"required":["expressions","title","description","attributes"],"type":"object"}},"required":["name","template"],"type":"object","description":"The JSON request body."}},"required":["id","requestBody"]},
    method: "put",
    pathTemplate: "/v2/alert_sources/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Alert Sources V2"],
    deprecated: false
  }],
  ["Alert_Sources_V2_Delete", {
    name: "Alert_Sources_V2_Delete",
    description: `Delete an existing alert source in your account.
(Tags: Alert Sources V2)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"The ID of this alert source","type":"string"}},"required":["id"]},
    method: "delete",
    pathTemplate: "/v2/alert_sources/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Alert Sources V2"],
    deprecated: false
  }],
  ["Alerts_V2_List", {
    name: "Alerts_V2_List",
    description: `List all alerts for your account.
\`\`\`bash

\`\`\`
This endpoint supports a number of filters, which can help find alerts matching certain
criteria. These filters work similarly to the filters on the incidents endpoint, where 
a field is specified alongside a comparison operator in the query string.

Note that:
- Filters may be used together, and the result will be alerts that match all filters.
- All query parameters must be URI encoded.

### By deduplication_key

Find all alerts with deduplication_key ABC:

\`\`\`bash
curl --get 'https://api.incident.io/v2/alerts' \\
--data 'deduplication_key[is]=ABC'
\`\`\`

### By status

Find all alerts in a firing state:

\`\`\`bash
curl --get 'https://api.incident.io/v2/alerts' \\
--data 'status[one_of]=firing'
\`\`\`

### By created_at
Find all alerts that follow specified date parameters for created_at field.
Possible values are "gte" (greater than or equal to), "lte" (less than or equal to), and 
"date_range" (between two dates). The following example finds all alerts created after 
2025-01-01:

\`\`\`bash
curl --get 'https://api.incident.io/v2/alerts' \\
--data 'created_at[gte]=2025-01-01'
\`\`\`

To find alerts created within a specific date range, use the date_range option with 
tilde-separated dates:

\`\`\`bash
curl --get 'https://api.incident.io/v2/alerts' \\
--data 'created_at[date_range]=2024-12-02~2024-12-08'

\`\`\`
(Tags: Alerts V2)`,
    inputSchema: {"type":"object","properties":{"page_size":{"default":25,"description":"Number of alerts to return per page","format":"int64","maximum":50,"minimum":1,"type":"number"},"after":{"description":"If provided, pass this as the 'after' param to load the next page","type":"string"},"deduplication_key":{"additionalProperties":{"example":["some_value"],"items":{"example":"some_value","type":"string"},"type":"array"},"description":"Filter on alert deduplication key. The accepted operator is 'is'.","type":"object"},"status":{"additionalProperties":{"example":["some_value"],"items":{"example":"some_value","type":"string"},"type":"array"},"description":"Filter on alert status. The accepted operators are 'one_of', or 'not_in'.","type":"object"},"created_at":{"additionalProperties":{"example":["some_value"],"items":{"example":"some_value","type":"string"},"type":"array"},"description":"Filter on alert created at timestamp. Accepted operators are 'gte', 'lte' and 'date_range'.","type":"object"}},"required":["page_size"]},
    method: "get",
    pathTemplate: "/v2/alerts",
    executionParameters: [{"name":"page_size","in":"query"},{"name":"after","in":"query"},{"name":"deduplication_key","in":"query"},{"name":"status","in":"query"},{"name":"created_at","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Alerts V2"],
    deprecated: false
  }],
  ["Alerts_V2_Show", {
    name: "Alerts_V2_Show",
    description: `Show a single alert for your account
(Tags: Alerts V2)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"Unique identifier for the alert","type":"string"}},"required":["id"]},
    method: "get",
    pathTemplate: "/v2/alerts/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Alerts V2"],
    deprecated: false
  }],
  ["Catalog_V2_ListEntries", {
    name: "Catalog_V2_ListEntries",
    description: `[DEPRECATED] List entries for a catalog type.
(Tags: Catalog V2)`,
    inputSchema: {"type":"object","properties":{"catalog_type_id":{"description":"ID of this catalog type","type":"string"},"page_size":{"default":25,"description":"Integer number of records to return","format":"int64","maximum":250,"type":"number"},"after":{"description":"An record's ID. This endpoint will return a list of records after this ID in relation to the API response order.","type":"string"}},"required":["catalog_type_id"]},
    method: "get",
    pathTemplate: "/v2/catalog_entries",
    executionParameters: [{"name":"catalog_type_id","in":"query"},{"name":"page_size","in":"query"},{"name":"after","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Catalog V2"],
    deprecated: true
  }],
  ["Catalog_V2_CreateEntry", {
    name: "Catalog_V2_CreateEntry",
    description: `[DEPRECATED] Create an entry within the catalog. We support a maximum of 50,000 entries per type.

If you call this API with a payload where the external_id and catalog_type_id match an existing entry, the existing entry will be updated.
(Tags: Catalog V2)`,
    inputSchema: {"type":"object","properties":{"requestBody":{"properties":{"aliases":{"description":"Optional aliases that can be used to reference this entry","items":{"type":"string"},"type":"array"},"attribute_values":{"additionalProperties":{"example":{"array_value":[{"literal":"SEV123","reference":"incident.severity"}],"value":{"literal":"SEV123","reference":"incident.severity"}},"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","example":[{"literal":"SEV123","reference":"incident.severity"}],"items":{"example":{"literal":"SEV123","reference":"incident.severity"},"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","example":"SEV123","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","example":"incident.severity","type":"string"}},"type":"object"},"type":"array"},"value":{"example":{"literal":"SEV123","reference":"incident.severity"},"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","example":"SEV123","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","example":"incident.severity","type":"string"}},"type":"object"}},"type":"object"},"description":"Values of this entry","type":"object"},"catalog_type_id":{"description":"ID of this catalog type","type":"string"},"external_id":{"description":"An optional alternative ID for this entry, which is ensured to be unique for the type","type":"string"},"name":{"description":"Name is the human readable name of this entry","type":"string"},"rank":{"description":"When catalog type is ranked, this is used to help order things","format":"int32","type":"number"}},"required":["catalog_type_id","name","attribute_values"],"type":"object","description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/v2/catalog_entries",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Catalog V2"],
    deprecated: true
  }],
  ["Catalog_V2_ShowEntry", {
    name: "Catalog_V2_ShowEntry",
    description: `[DEPRECATED] Show a single catalog entry.
(Tags: Catalog V2)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"ID of this catalog entry","type":"string"}},"required":["id"]},
    method: "get",
    pathTemplate: "/v2/catalog_entries/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Catalog V2"],
    deprecated: true
  }],
  ["Catalog_V2_UpdateEntry", {
    name: "Catalog_V2_UpdateEntry",
    description: `[DEPRECATED] Updates an existing catalog entry.
(Tags: Catalog V2)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"ID of this catalog entry","type":"string"},"requestBody":{"properties":{"aliases":{"description":"Optional aliases that can be used to reference this entry","items":{"type":"string"},"type":"array"},"attribute_values":{"additionalProperties":{"example":{"array_value":[{"literal":"SEV123","reference":"incident.severity"}],"value":{"literal":"SEV123","reference":"incident.severity"}},"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","example":[{"literal":"SEV123","reference":"incident.severity"}],"items":{"example":{"literal":"SEV123","reference":"incident.severity"},"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","example":"SEV123","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","example":"incident.severity","type":"string"}},"type":"object"},"type":"array"},"value":{"example":{"literal":"SEV123","reference":"incident.severity"},"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","example":"SEV123","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","example":"incident.severity","type":"string"}},"type":"object"}},"type":"object"},"description":"Values of this entry","type":"object"},"external_id":{"description":"An optional alternative ID for this entry, which is ensured to be unique for the type","type":"string"},"name":{"description":"Name is the human readable name of this entry","type":"string"},"rank":{"description":"When catalog type is ranked, this is used to help order things","format":"int32","type":"number"}},"required":["name","attribute_values"],"type":"object","description":"The JSON request body."}},"required":["id","requestBody"]},
    method: "put",
    pathTemplate: "/v2/catalog_entries/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Catalog V2"],
    deprecated: true
  }],
  ["Catalog_V2_DestroyEntry", {
    name: "Catalog_V2_DestroyEntry",
    description: `[DEPRECATED] Archives a catalog entry.
(Tags: Catalog V2)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"ID of this catalog entry","type":"string"}},"required":["id"]},
    method: "delete",
    pathTemplate: "/v2/catalog_entries/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Catalog V2"],
    deprecated: true
  }],
  ["Catalog_V2_ListResources", {
    name: "Catalog_V2_ListResources",
    description: `[DEPRECATED] List available engine resources for the catalog.

A resource represents a type of data that can be held within the catalog, so this
endpoint can be used to see what attribute types can be used when updating the
schema of a catalog type.

(Tags: Catalog V2)`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/v2/catalog_resources",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Catalog V2"],
    deprecated: true
  }],
  ["Catalog_V2_ListTypes", {
    name: "Catalog_V2_ListTypes",
    description: `[DEPRECATED] List all catalog types for an organisation, including those synced from external resources.
(Tags: Catalog V2)`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/v2/catalog_types",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Catalog V2"],
    deprecated: true
  }],
  ["Catalog_V2_CreateType", {
    name: "Catalog_V2_CreateType",
    description: `[DEPRECATED] Create a catalog type. The schema must be updated using the UpdateTypeSchema endpoint.
(Tags: Catalog V2)`,
    inputSchema: {"type":"object","properties":{"requestBody":{"properties":{"annotations":{"additionalProperties":{"example":"abc123","type":"string"},"description":"Annotations that can track metadata about this type","type":"object"},"categories":{"description":"What categories is this type considered part of","items":{"enum":["customer","issue-tracker","product-feature","service","on-call","team","user"],"type":"string"},"type":"array"},"color":{"description":"Sets the display color of this type in the dashboard","enum":["yellow","green","blue","violet","pink","cyan","orange"],"type":"string"},"description":{"description":"Human readble description of this type","type":"string"},"icon":{"description":"Sets the display icon of this type in the dashboard","enum":["alert","bolt","box","briefcase","browser","bulb","calendar","clock","cog","components","database","doc","email","escalation-path","files","flag","folder","globe","money","server","severity","status-page","store","star","tag","user","users"],"type":"string"},"name":{"description":"Name is the human readable name of this type","type":"string"},"ranked":{"description":"If this type should be ranked","type":"boolean"},"source_repo_url":{"description":"The url of the external repository where this type is managed","type":"string"},"type_name":{"description":"The type name of this catalog type, to be used when defining attributes. This is immutable once a CatalogType has been created. For non-externally sync types, it must follow the pattern Custom[\"SomeName\"]","type":"string"}},"required":["name","description"],"type":"object","description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/v2/catalog_types",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Catalog V2"],
    deprecated: true
  }],
  ["Catalog_V2_ShowType", {
    name: "Catalog_V2_ShowType",
    description: `[DEPRECATED] Show a single catalog type.
(Tags: Catalog V2)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"ID of this catalog type","type":"string"}},"required":["id"]},
    method: "get",
    pathTemplate: "/v2/catalog_types/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Catalog V2"],
    deprecated: true
  }],
  ["Catalog_V2_UpdateType", {
    name: "Catalog_V2_UpdateType",
    description: `[DEPRECATED] Updates an existing catalog type. The schema must be updated using the UpdateTypeSchema endpoint.
(Tags: Catalog V2)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"ID of this catalog type","type":"string"},"requestBody":{"properties":{"annotations":{"additionalProperties":{"example":"abc123","type":"string"},"description":"Annotations that can track metadata about this type","type":"object"},"categories":{"description":"What categories is this type considered part of","items":{"enum":["customer","issue-tracker","product-feature","service","on-call","team","user"],"type":"string"},"type":"array"},"color":{"description":"Sets the display color of this type in the dashboard","enum":["yellow","green","blue","violet","pink","cyan","orange"],"type":"string"},"description":{"description":"Human readble description of this type","type":"string"},"icon":{"description":"Sets the display icon of this type in the dashboard","enum":["alert","bolt","box","briefcase","browser","bulb","calendar","clock","cog","components","database","doc","email","escalation-path","files","flag","folder","globe","money","server","severity","status-page","store","star","tag","user","users"],"type":"string"},"name":{"description":"Name is the human readable name of this type","type":"string"},"ranked":{"description":"If this type should be ranked","type":"boolean"},"source_repo_url":{"description":"The url of the external repository where this type is managed","type":"string"}},"required":["name","description"],"type":"object","description":"The JSON request body."}},"required":["id","requestBody"]},
    method: "put",
    pathTemplate: "/v2/catalog_types/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Catalog V2"],
    deprecated: true
  }],
  ["Catalog_V2_DestroyType", {
    name: "Catalog_V2_DestroyType",
    description: `[DEPRECATED] Archives a catalog type and associated entries.
(Tags: Catalog V2)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"ID of this catalog type","type":"string"}},"required":["id"]},
    method: "delete",
    pathTemplate: "/v2/catalog_types/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Catalog V2"],
    deprecated: true
  }],
  ["Catalog_V2_UpdateTypeSchema", {
    name: "Catalog_V2_UpdateTypeSchema",
    description: `[DEPRECATED] Update an existing catalog types schema, adding or removing attributes.

Updating the schema is handled separately from creating and updating types, so that you don't
have to worry about dependencies between types. For example, if type A has an attribute that
relies on type B, you would have to create type B first.

By allowing the creation of types without a schema, they can be created in any order, but it
means that you need to make a separate call to this endpoint to update the schema.
(Tags: Catalog V2)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"ID of this catalog type","type":"string"},"requestBody":{"properties":{"attributes":{"items":{"properties":{"array":{"description":"Whether this attribute is an array","type":"boolean"},"backlink_attribute":{"description":"The attribute to use (if this is a backlink)","type":"string"},"id":{"description":"The ID of this attribute","type":"string"},"mode":{"description":"Controls how this attribute is modified","enum":["","manual","external","internal","dynamic","backlink","path"],"type":"string","x-public-api-version":"v2"},"name":{"description":"Unique name of this attribute","type":"string"},"path":{"description":"The path to use (if this is an path)","items":{"properties":{"attribute_id":{"description":"the ID of the attribute to use","type":"string"}},"required":["attribute_id"],"type":"object"},"type":"array"},"type":{"description":"Catalog type name for this attribute","type":"string"}},"required":["name","type","array"],"type":"object"},"type":"array"},"version":{"format":"int64","type":"number"}},"required":["attributes","version"],"type":"object","description":"The JSON request body."}},"required":["id","requestBody"]},
    method: "post",
    pathTemplate: "/v2/catalog_types/{id}/actions/update_schema",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Catalog V2"],
    deprecated: true
  }],
  ["Custom_Fields_V2_List", {
    name: "Custom_Fields_V2_List",
    description: `List all custom fields for an organisation.
(Tags: Custom Fields V2)`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/v2/custom_fields",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Custom Fields V2"],
    deprecated: false
  }],
  ["Custom_Fields_V2_Create", {
    name: "Custom_Fields_V2_Create",
    description: `Create a new custom field
(Tags: Custom Fields V2)`,
    inputSchema: {"type":"object","properties":{"requestBody":{"properties":{"catalog_type_id":{"description":"For catalog fields, the ID of the associated catalog type","type":"string"},"description":{"description":"Description of the custom field","type":"string"},"field_type":{"description":"Type of custom field","enum":["single_select","multi_select","text","link","numeric"],"type":"string"},"filter_by":{"properties":{"catalog_attribute_id":{"description":"This must be an attribute of the catalog type of this custom field. It must be an attribute that points to another catalog type (so not a plain string, number, or boolean attribute).","type":"string"},"custom_field_id":{"description":"This must be the ID of a custom field, which must have values of the same type as the attribute you are filtering by.\n\nWhen this filtering field is set on an incident, the options for this custom field will be filtered to only those with the attribute value that matches the value of the filtering field.","type":"string"}},"required":["custom_field_id","catalog_attribute_id"],"type":"object"},"group_by_catalog_attribute_id":{"description":"For catalog fields, the ID of the attribute used to group catalog entries (if applicable)","type":"string"},"helptext_catalog_attribute_id":{"description":"Which catalog attribute provides helptext for the options","type":"string"},"name":{"description":"Human readable name for the custom field","maxLength":50,"type":"string"}},"required":["name","description","field_type"],"type":"object","description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/v2/custom_fields",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Custom Fields V2"],
    deprecated: false
  }],
  ["Custom_Fields_V2_Show", {
    name: "Custom_Fields_V2_Show",
    description: `Get a single custom field.
(Tags: Custom Fields V2)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"Unique identifier for the custom field","type":"string"}},"required":["id"]},
    method: "get",
    pathTemplate: "/v2/custom_fields/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Custom Fields V2"],
    deprecated: false
  }],
  ["Custom_Fields_V2_Update", {
    name: "Custom_Fields_V2_Update",
    description: `Update the details of a custom field
(Tags: Custom Fields V2)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"Unique identifier for the custom field","type":"string"},"requestBody":{"properties":{"description":{"description":"Description of the custom field","type":"string"},"filter_by":{"properties":{"catalog_attribute_id":{"description":"This must be an attribute of the catalog type of this custom field. It must be an attribute that points to another catalog type (so not a plain string, number, or boolean attribute).","type":"string"},"custom_field_id":{"description":"This must be the ID of a custom field, which must have values of the same type as the attribute you are filtering by.\n\nWhen this filtering field is set on an incident, the options for this custom field will be filtered to only those with the attribute value that matches the value of the filtering field.","type":"string"}},"required":["custom_field_id","catalog_attribute_id"],"type":"object"},"group_by_catalog_attribute_id":{"description":"For catalog fields, the ID of the attribute used to group catalog entries (if applicable)","type":"string"},"helptext_catalog_attribute_id":{"description":"Which catalog attribute provides helptext for the options","type":"string"},"name":{"description":"Human readable name for the custom field","maxLength":50,"type":"string"}},"required":["name","description"],"type":"object","description":"The JSON request body."}},"required":["id","requestBody"]},
    method: "put",
    pathTemplate: "/v2/custom_fields/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Custom Fields V2"],
    deprecated: false
  }],
  ["Custom_Fields_V2_Delete", {
    name: "Custom_Fields_V2_Delete",
    description: `Delete a custom field
(Tags: Custom Fields V2)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"Unique identifier for the custom field","type":"string"}},"required":["id"]},
    method: "delete",
    pathTemplate: "/v2/custom_fields/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Custom Fields V2"],
    deprecated: false
  }],
  ["Escalations_V2_ListPaths", {
    name: "Escalations_V2_ListPaths",
    description: `List all escalation paths in your account.

An escalation path is a series of steps that describe how a page should be escalated,
represented as a graph, supporting conditional branches based on alert priority and
working intervals.

(Tags: Escalations V2)`,
    inputSchema: {"type":"object","properties":{"page_size":{"default":25,"description":"Integer number of records to return","format":"int64","maximum":25,"minimum":1,"type":"number"},"after":{"description":"An record's ID. This endpoint will return a list of records after this ID in relation to the API response order.","type":"string"}}},
    method: "get",
    pathTemplate: "/v2/escalation_paths",
    executionParameters: [{"name":"page_size","in":"query"},{"name":"after","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Escalations V2"],
    deprecated: false
  }],
  ["Escalations_V2_CreatePath", {
    name: "Escalations_V2_CreatePath",
    description: `Create an escalation path.

An escalation path is a series of steps that describe how a page should be escalated,
represented as graph, supporting conditional branches based on alert priority and working
intervals.

We recommend you create escalation paths in the incident.io dashboard where our path
builder makes it easy to use conditions and visualise the path.

(Tags: Escalations V2)`,
    inputSchema: {"type":"object","properties":{"requestBody":{"properties":{"name":{"description":"The name of this escalation path, for the user's reference.","type":"string"},"path":{"description":"The nodes that form the levels and branches of this escalation path.","items":{"properties":{"id":{"description":"An ID for this node, unique within the escalation path.\n\nThis allows you to reference the node in other nodes, such as when configuring a 'repeat' node.","type":"string"},"if_else":{"properties":{"conditions":{"description":"The condition that defines which branch to take","items":{"properties":{"operation":{"description":"The name of the operation on the subject","type":"string"},"param_bindings":{"description":"List of parameter bindings","items":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"},"type":"array"},"subject":{"description":"The reference of the subject in the trigger scope","type":"string"}},"required":["subject","operation","param_bindings"],"type":"object"},"type":"array"},"else_path":{"description":"The nodes that form the levels if our condition is not met","items":{"type":"object"},"type":"array"},"then_path":{"description":"The nodes that form the levels if our condition is met","items":{"type":"object"},"type":"array"}},"required":["then_path","else_path"],"type":"object"},"level":{"properties":{"ack_mode":{"description":"Controls the behaviour of acknowledgements for this level, with 'first' cancelling all other escalations on the same level when someone acks","enum":["all","first"],"type":"string"},"round_robin_config":{"properties":{"enabled":{"description":"Whether round robin is enabled for this level","type":"boolean"},"rotate_after_seconds":{"description":"How long should we wait before rotating to the next target in a round robin, if not set will stick with a single target per level.","format":"int64","type":"number"}},"required":["enabled"],"type":"object"},"targets":{"description":"The targets (users or schedules) for this level","items":{"properties":{"id":{"description":"Uniquely identifies an entity of this type","type":"string"},"schedule_mode":{"description":"Only set for schedule targets, and either currently_on_call, all_users or all_users_for_rota and specifies which users to fetch from the schedule","enum":["currently_on_call","all_users_for_rota","all_users",""],"type":"string"},"type":{"description":"Controls what type of entity this target identifies, such as EscalationPolicy or User","enum":["schedule","user","slack_channel","msteams_channel"],"type":"string","x-public-api-version":"v2"},"urgency":{"description":"The urgency of this escalation path target","enum":["high","low"],"type":"string"}},"required":["type","id","urgency"],"type":"object"},"type":"array"},"time_to_ack_interval_condition":{"description":"If the time to ack is relative to a time window, this defines whether we move when the window is active or inactive","enum":["active","inactive"],"type":"string"},"time_to_ack_seconds":{"description":"How long should we wait for this level to acknowledge before proceeding to the next node in the path?","format":"int64","type":"number"},"time_to_ack_weekday_interval_config_id":{"description":"If the time to ack is relative to a time window, this identifies which window it is relative to","type":"string"}},"required":["targets"],"type":"object"},"notify_channel":{"properties":{"targets":{"description":"The targets (Slack channels) for this level","items":{"properties":{"id":{"description":"Uniquely identifies an entity of this type","type":"string"},"schedule_mode":{"description":"Only set for schedule targets, and either currently_on_call, all_users or all_users_for_rota and specifies which users to fetch from the schedule","enum":["currently_on_call","all_users_for_rota","all_users",""],"type":"string"},"type":{"description":"Controls what type of entity this target identifies, such as EscalationPolicy or User","enum":["schedule","user","slack_channel","msteams_channel"],"type":"string","x-public-api-version":"v2"},"urgency":{"description":"The urgency of this escalation path target","enum":["high","low"],"type":"string"}},"required":["type","id","urgency"],"type":"object"},"type":"array"},"time_to_ack_interval_condition":{"description":"If the time to ack is relative to a time window, this defines whether we move when the window is active or inactive","enum":["active","inactive"],"type":"string"},"time_to_ack_seconds":{"description":"How long should we wait for this level to acknowledge before moving on to the next node in the path?","format":"int64","type":"number"},"time_to_ack_weekday_interval_config_id":{"description":"If the time to ack is relative to a time window, this identifies which window it is relative to","type":"string"}},"required":["targets"],"type":"object"},"repeat":{"properties":{"repeat_times":{"description":"How many times to repeat these nodes","format":"int64","type":"number"},"to_node":{"description":"Which node ID we begin repeating from.","type":"string"}},"required":["to_node","repeat_times"],"type":"object"},"type":{"description":"The type of this node. Available types are:\n* level: A set of targets (users or schedules) that should be paged, either all at once, or with a round-robin configuration.\n* notify_channel: Send the escalation to a Slack channel, where it can be acked by anyone in the channel.\n* if_else: Branch the escalation based on a set of conditions.\n* repeat: Go back to a previous node and repeat the logic from there.","enum":["if_else","repeat","level","notify_channel"],"type":"string"}},"required":["id","type"],"type":"object"},"type":"array"},"team_ids":{"description":"IDs of the teams that own this escalation path. This will automatically sync escalation paths with the right teams in Catalog. If you have an escalation paths attribute on your Teams, this attribute is required.","items":{"type":"string"},"type":"array"},"working_hours":{"description":"The working hours for this escalation path.","items":{"properties":{"id":{"description":"The unique identifier for this set of working intervals","type":"string"},"name":{"description":"A human readable label for this set of working intervals","type":"string"},"timezone":{"description":"How to interpret all the intervals","type":"string"},"weekday_intervals":{"items":{"properties":{"end_time":{"description":"End time of the interval, in 24hr format","type":"string"},"start_time":{"description":"Start time of the interval, in 24hr format","type":"string"},"weekday":{"description":"Weekdays for use within a schedule or escalation path","enum":["monday","tuesday","wednesday","thursday","friday","saturday","sunday"],"type":"string","x-public-api-version":"v2"}},"required":["weekday","start_time","end_time"],"type":"object"},"type":"array"}},"required":["id","name","timezone","weekday_intervals"],"type":"object"},"type":"array"}},"required":["name","path"],"type":"object","description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/v2/escalation_paths",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Escalations V2"],
    deprecated: false
  }],
  ["Escalations_V2_ShowPath", {
    name: "Escalations_V2_ShowPath",
    description: `Show an escalation path.

We recommend you create escalation paths in the incident.io dashboard where our path
builder makes it easy to use conditions and visualise the path.

(Tags: Escalations V2)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"Unique identifier for this escalation path.","type":"string"}},"required":["id"]},
    method: "get",
    pathTemplate: "/v2/escalation_paths/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Escalations V2"],
    deprecated: false
  }],
  ["Escalations_V2_UpdatePath", {
    name: "Escalations_V2_UpdatePath",
    description: `Updates an escalation path.

We recommend you create escalation paths in the incident.io dashboard where our path
builder makes it easy to use conditions and visualise the path.

(Tags: Escalations V2)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"Unique identifier for this escalation path.","type":"string"},"requestBody":{"properties":{"name":{"description":"The name of this escalation path, for the user's reference.","type":"string"},"path":{"description":"The nodes that form the levels and branches of this escalation path.","items":{"properties":{"id":{"description":"An ID for this node, unique within the escalation path.\n\nThis allows you to reference the node in other nodes, such as when configuring a 'repeat' node.","type":"string"},"if_else":{"properties":{"conditions":{"description":"The condition that defines which branch to take","items":{"properties":{"operation":{"description":"The name of the operation on the subject","type":"string"},"param_bindings":{"description":"List of parameter bindings","items":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"},"type":"array"},"subject":{"description":"The reference of the subject in the trigger scope","type":"string"}},"required":["subject","operation","param_bindings"],"type":"object"},"type":"array"},"else_path":{"description":"The nodes that form the levels if our condition is not met","items":{"type":"object"},"type":"array"},"then_path":{"description":"The nodes that form the levels if our condition is met","items":{"type":"object"},"type":"array"}},"required":["then_path","else_path"],"type":"object"},"level":{"properties":{"ack_mode":{"description":"Controls the behaviour of acknowledgements for this level, with 'first' cancelling all other escalations on the same level when someone acks","enum":["all","first"],"type":"string"},"round_robin_config":{"properties":{"enabled":{"description":"Whether round robin is enabled for this level","type":"boolean"},"rotate_after_seconds":{"description":"How long should we wait before rotating to the next target in a round robin, if not set will stick with a single target per level.","format":"int64","type":"number"}},"required":["enabled"],"type":"object"},"targets":{"description":"The targets (users or schedules) for this level","items":{"properties":{"id":{"description":"Uniquely identifies an entity of this type","type":"string"},"schedule_mode":{"description":"Only set for schedule targets, and either currently_on_call, all_users or all_users_for_rota and specifies which users to fetch from the schedule","enum":["currently_on_call","all_users_for_rota","all_users",""],"type":"string"},"type":{"description":"Controls what type of entity this target identifies, such as EscalationPolicy or User","enum":["schedule","user","slack_channel","msteams_channel"],"type":"string","x-public-api-version":"v2"},"urgency":{"description":"The urgency of this escalation path target","enum":["high","low"],"type":"string"}},"required":["type","id","urgency"],"type":"object"},"type":"array"},"time_to_ack_interval_condition":{"description":"If the time to ack is relative to a time window, this defines whether we move when the window is active or inactive","enum":["active","inactive"],"type":"string"},"time_to_ack_seconds":{"description":"How long should we wait for this level to acknowledge before proceeding to the next node in the path?","format":"int64","type":"number"},"time_to_ack_weekday_interval_config_id":{"description":"If the time to ack is relative to a time window, this identifies which window it is relative to","type":"string"}},"required":["targets"],"type":"object"},"notify_channel":{"properties":{"targets":{"description":"The targets (Slack channels) for this level","items":{"properties":{"id":{"description":"Uniquely identifies an entity of this type","type":"string"},"schedule_mode":{"description":"Only set for schedule targets, and either currently_on_call, all_users or all_users_for_rota and specifies which users to fetch from the schedule","enum":["currently_on_call","all_users_for_rota","all_users",""],"type":"string"},"type":{"description":"Controls what type of entity this target identifies, such as EscalationPolicy or User","enum":["schedule","user","slack_channel","msteams_channel"],"type":"string","x-public-api-version":"v2"},"urgency":{"description":"The urgency of this escalation path target","enum":["high","low"],"type":"string"}},"required":["type","id","urgency"],"type":"object"},"type":"array"},"time_to_ack_interval_condition":{"description":"If the time to ack is relative to a time window, this defines whether we move when the window is active or inactive","enum":["active","inactive"],"type":"string"},"time_to_ack_seconds":{"description":"How long should we wait for this level to acknowledge before moving on to the next node in the path?","format":"int64","type":"number"},"time_to_ack_weekday_interval_config_id":{"description":"If the time to ack is relative to a time window, this identifies which window it is relative to","type":"string"}},"required":["targets"],"type":"object"},"repeat":{"properties":{"repeat_times":{"description":"How many times to repeat these nodes","format":"int64","type":"number"},"to_node":{"description":"Which node ID we begin repeating from.","type":"string"}},"required":["to_node","repeat_times"],"type":"object"},"type":{"description":"The type of this node. Available types are:\n* level: A set of targets (users or schedules) that should be paged, either all at once, or with a round-robin configuration.\n* notify_channel: Send the escalation to a Slack channel, where it can be acked by anyone in the channel.\n* if_else: Branch the escalation based on a set of conditions.\n* repeat: Go back to a previous node and repeat the logic from there.","enum":["if_else","repeat","level","notify_channel"],"type":"string"}},"required":["id","type"],"type":"object"},"type":"array"},"team_ids":{"description":"IDs of the teams that own this escalation path. This will automatically sync escalation paths with the right teams in Catalog. If you have an escalation paths attribute on your Teams, this attribute is required.","items":{"type":"string"},"type":"array"},"working_hours":{"description":"The working hours for this escalation path.","items":{"properties":{"id":{"description":"The unique identifier for this set of working intervals","type":"string"},"name":{"description":"A human readable label for this set of working intervals","type":"string"},"timezone":{"description":"How to interpret all the intervals","type":"string"},"weekday_intervals":{"items":{"properties":{"end_time":{"description":"End time of the interval, in 24hr format","type":"string"},"start_time":{"description":"Start time of the interval, in 24hr format","type":"string"},"weekday":{"description":"Weekdays for use within a schedule or escalation path","enum":["monday","tuesday","wednesday","thursday","friday","saturday","sunday"],"type":"string","x-public-api-version":"v2"}},"required":["weekday","start_time","end_time"],"type":"object"},"type":"array"}},"required":["id","name","timezone","weekday_intervals"],"type":"object"},"type":"array"}},"required":["name","path"],"type":"object","description":"The JSON request body."}},"required":["id","requestBody"]},
    method: "put",
    pathTemplate: "/v2/escalation_paths/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Escalations V2"],
    deprecated: false
  }],
  ["Escalations_V2_DestroyPath", {
    name: "Escalations_V2_DestroyPath",
    description: `Archives an escalation path.

We recommend you create escalation paths in the incident.io dashboard where our path
builder makes it easy to use conditions and visualise the path.

(Tags: Escalations V2)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"Unique identifier for this escalation path.","type":"string"}},"required":["id"]},
    method: "delete",
    pathTemplate: "/v2/escalation_paths/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Escalations V2"],
    deprecated: false
  }],
  ["Escalations_V2_List", {
    name: "Escalations_V2_List",
    description: `List all escalations for your account.

This endpoint supports a number of filters, which can help find escalations matching certain
criteria.

Note that:
- Filters may be used together, and the result will be escalations that match all filters.
- All query parameters must be URI encoded.

To use this API, you will need an API key with the "View data" or "Create and manage on-call resources" permission.

### By escalation_path

Find all escalations that escalated to escalation path with id=ABC:

\`\`\`bash
curl --get 'https://api.incident.io/v2/escalations' \\
--data 'escalation_path[one_of]=ABC'
\`\`\`

### By status

Find all escalations with a current status of "triggered":

\`\`\`bash
curl --get 'https://api.incident.io/v2/escalations' \\
--data 'status[one_of]=triggered'
\`\`\`

Possible values are "pending", "triggered", "acked", "resolved", "expired" and "cancelled".
Escalations are in "pending" when they are in a grace period when the related alert has
been grouped in an incident.

### By alert

Find all escalations that were created by alert with id=ABC:

\`\`\`bash
curl --get 'https://api.incident.io/v2/escalations' \\
--data 'alert[one_of]=ABC'
\`\`\`

### By created_at and updated_at
Find all escalations that follow specified date parameters for created_at and updated_at fields.
Possible values are "gte" (greater than or equal to), "lte" (less than or equal to), and
"date_range" (between two dates).
For example, to find all escalations updated after 2025-01-01:

\`\`\`bash
curl --get 'https://api.incident.io/v2/escalations' \\
--data 'updated_at[gte]=2025-01-01'
\`\`\`

To find all escalations created between 2025-01-01 and 2025-01-31:

\`\`\`bash
curl --get 'https://api.incident.io/v2/escalations' \\
\`\`\`
            --data 'created_at[date_range]=2025-01-01~2025-01-31'

(Tags: Escalations V2)`,
    inputSchema: {"type":"object","properties":{"page_size":{"default":25,"description":"Number of escalations to return per page","format":"int64","maximum":50,"minimum":1,"type":"number"},"after":{"description":"An escalation's ID. This endpoint will return a list of escalations after this ID in relation to the API response order.","type":"string"},"escalation_path":{"additionalProperties":{"example":["some_value"],"items":{"example":"some_value","type":"string"},"type":"array"},"description":"Filter on the escalation path for which the escalation was triggered. Accepted operators are 'one_of' and 'not_in'.","type":"object"},"status":{"additionalProperties":{"example":["some_value"],"items":{"example":"some_value","type":"string"},"type":"array"},"description":"Filter on the status of the escalation. Accepted operators are 'one_of' and 'not_in'.","type":"object"},"alert":{"additionalProperties":{"example":["some_value"],"items":{"example":"some_value","type":"string"},"type":"array"},"description":"Filter on the alert that created an escalation. Accepted operators are 'one_of' and 'not_in'.","type":"object"},"created_at":{"additionalProperties":{"example":["some_value"],"items":{"example":"some_value","type":"string"},"type":"array"},"description":"Filter on the created_at timestamp of the escalation. Accepted operators are 'gte', 'lte' and 'date_range'.","type":"object"},"updated_at":{"additionalProperties":{"example":["some_value"],"items":{"example":"some_value","type":"string"},"type":"array"},"description":"Filter on the updated_at timestamp of the escalation. Accepted operators are 'gte', 'lte' and 'date_range'.","type":"object"},"idempotency_key":{"additionalProperties":{"example":["some_value"],"items":{"example":"some_value","type":"string"},"type":"array"},"description":"Filter on the idempotency key of the escalation. This is the key set when creating escalations via the API, and is distinct from alert deduplication keys. Accepted operators are 'is' for exact matches and 'starts_with' for prefix matching.","type":"object"}}},
    method: "get",
    pathTemplate: "/v2/escalations",
    executionParameters: [{"name":"page_size","in":"query"},{"name":"after","in":"query"},{"name":"escalation_path","in":"query"},{"name":"status","in":"query"},{"name":"alert","in":"query"},{"name":"created_at","in":"query"},{"name":"updated_at","in":"query"},{"name":"idempotency_key","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Escalations V2"],
    deprecated: false
  }],
  ["Escalations_V2_Create", {
    name: "Escalations_V2_Create",
    description: `Create an escalation.

An escalation pages people, either according to an escalation path, or directly to
specific users. You must provide either an escalation_path_id OR user_ids, but not both.

When escalating via an escalation path, the escalation will follow the configured path
with its levels and timeouts, using your default [alert
priority](https://app.incident.io/~/settings/alerts/configuration/priorities).

When escalating directly to users, they will receive a high-urgency
notification, based on their notification rules.

This endpoint is rate-limited to 60 requests per minute, since it is intended for
interactive use cases (for example someone clicking a "escalate to team" button
in your internal developer platform). To escalate based on automated alerts, we
recommend sending events to an alert source instead.

(Tags: Escalations V2)`,
    inputSchema: {"type":"object","properties":{"requestBody":{"properties":{"description":{"description":"Additional details about the escalation","type":"string"},"escalation_path_id":{"description":"ID of the escalation path to follow","type":"string"},"idempotency_key":{"description":"Unique key to prevent duplicate escalations. If this key has already been used, the existing escalation will be returned.","type":"string"},"title":{"description":"The title of the escalation. This message will be included in all notifications about this escalation.","type":"string"},"user_ids":{"description":"IDs of users to escalate directly to","items":{"type":"string"},"type":"array"}},"required":["idempotency_key","title"],"type":"object","description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/v2/escalations",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Escalations V2"],
    deprecated: false
  }],
  ["Escalations_V2_Show", {
    name: "Escalations_V2_Show",
    description: `Show a specific escalation.
(Tags: Escalations V2)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"Unique ID of the escalation","type":"string"}},"required":["id"]},
    method: "get",
    pathTemplate: "/v2/escalations/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Escalations V2"],
    deprecated: false
  }],
  ["Follow-ups_V2_List", {
    name: "Follow-ups_V2_List",
    description: `List all follow-ups for an organisation.
(Tags: Follow-ups V2)`,
    inputSchema: {"type":"object","properties":{"incident_id":{"description":"Find follow-ups related to this incident","type":"string"},"incident_mode":{"description":"Filter to follow-ups from incidents of the given mode. If not set, only follow-ups from `standard` and `retrospective` incidents are returned","enum":["standard","retrospective","test","tutorial","stream"],"type":"string"}}},
    method: "get",
    pathTemplate: "/v2/follow_ups",
    executionParameters: [{"name":"incident_id","in":"query"},{"name":"incident_mode","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Follow-ups V2"],
    deprecated: false
  }],
  ["Follow-ups_V2_Show", {
    name: "Follow-ups_V2_Show",
    description: `Get a single incident follow-up.
(Tags: Follow-ups V2)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"Unique identifier for the follow-up","type":"string"}},"required":["id"]},
    method: "get",
    pathTemplate: "/v2/follow_ups/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Follow-ups V2"],
    deprecated: false
  }],
  ["Alerts_V2_ListIncidentAlerts", {
    name: "Alerts_V2_ListIncidentAlerts",
    description: `List the connections between incidents and alerts
(Tags: Alerts V2)`,
    inputSchema: {"type":"object","properties":{"page_size":{"default":25,"description":"Number of incident alerts to return per page","format":"int64","maximum":50,"minimum":1,"type":"number"},"after":{"description":"If provided, pass this as the 'after' param to load the next page","type":"string"},"alert_id":{"description":"Alert that this incident alert refers to","type":"string"},"incident_id":{"description":"Incident that this incident alert is attached to","type":"string"}},"required":["page_size"]},
    method: "get",
    pathTemplate: "/v2/incident_alerts",
    executionParameters: [{"name":"page_size","in":"query"},{"name":"after","in":"query"},{"name":"alert_id","in":"query"},{"name":"incident_id","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Alerts V2"],
    deprecated: false
  }],
  ["Incident_Roles_V2_List", {
    name: "Incident_Roles_V2_List",
    description: `List all incident roles for an organisation.
(Tags: Incident Roles V2)`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/v2/incident_roles",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Incident Roles V2"],
    deprecated: false
  }],
  ["Incident_Roles_V2_Create", {
    name: "Incident_Roles_V2_Create",
    description: `Create a new incident role
(Tags: Incident Roles V2)`,
    inputSchema: {"type":"object","properties":{"requestBody":{"properties":{"description":{"description":"Describes the purpose of the role","minLength":1,"type":"string"},"instructions":{"description":"Provided to whoever is nominated for the role. Note that this will be empty for the 'reporter' role.","type":"string"},"name":{"description":"Human readable name of the incident role","minLength":1,"type":"string"},"shortform":{"description":"Short human readable name for Slack. Note that this will be empty for the 'reporter' role.","type":"string"}},"required":["name","shortform","description","instructions"],"type":"object","description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/v2/incident_roles",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Incident Roles V2"],
    deprecated: false
  }],
  ["Incident_Roles_V2_Show", {
    name: "Incident_Roles_V2_Show",
    description: `Get a single incident role.
(Tags: Incident Roles V2)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"Unique identifier for the role","type":"string"}},"required":["id"]},
    method: "get",
    pathTemplate: "/v2/incident_roles/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Incident Roles V2"],
    deprecated: false
  }],
  ["Incident_Roles_V2_Update", {
    name: "Incident_Roles_V2_Update",
    description: `Update an existing incident role
(Tags: Incident Roles V2)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"Unique identifier for the role","type":"string"},"requestBody":{"properties":{"description":{"description":"Describes the purpose of the role","minLength":1,"type":"string"},"instructions":{"description":"Provided to whoever is nominated for the role. Note that this will be empty for the 'reporter' role.","type":"string"},"name":{"description":"Human readable name of the incident role","minLength":1,"type":"string"},"shortform":{"description":"Short human readable name for Slack. Note that this will be empty for the 'reporter' role.","type":"string"}},"required":["name","shortform","description","instructions"],"type":"object","description":"The JSON request body."}},"required":["id","requestBody"]},
    method: "put",
    pathTemplate: "/v2/incident_roles/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Incident Roles V2"],
    deprecated: false
  }],
  ["Incident_Roles_V2_Delete", {
    name: "Incident_Roles_V2_Delete",
    description: `Removes an existing role
(Tags: Incident Roles V2)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"Unique identifier for the role","type":"string"}},"required":["id"]},
    method: "delete",
    pathTemplate: "/v2/incident_roles/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Incident Roles V2"],
    deprecated: false
  }],
  ["Incident_Timestamps_V2_List", {
    name: "Incident_Timestamps_V2_List",
    description: `List all incident timestamps for an organisation.
(Tags: Incident Timestamps V2)`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/v2/incident_timestamps",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Incident Timestamps V2"],
    deprecated: false
  }],
  ["Incident_Timestamps_V2_Show", {
    name: "Incident_Timestamps_V2_Show",
    description: `Get a single incident timestamp.
(Tags: Incident Timestamps V2)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"Unique ID of this incident timestamp","type":"string"}},"required":["id"]},
    method: "get",
    pathTemplate: "/v2/incident_timestamps/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Incident Timestamps V2"],
    deprecated: false
  }],
  ["Incident_Updates_V2_List", {
    name: "Incident_Updates_V2_List",
    description: `List all incident updates for an organisation, or for a specific incident.
(Tags: Incident Updates V2)`,
    inputSchema: {"type":"object","properties":{"incident_id":{"description":"Incident whose updates you want to list","type":"string"},"page_size":{"default":25,"description":"Integer number of records to return","format":"int64","maximum":250,"type":"number"},"after":{"description":"An record's ID. This endpoint will return a list of records after this ID in relation to the API response order.","type":"string"}}},
    method: "get",
    pathTemplate: "/v2/incident_updates",
    executionParameters: [{"name":"incident_id","in":"query"},{"name":"page_size","in":"query"},{"name":"after","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Incident Updates V2"],
    deprecated: false
  }],
  ["Incidents_V2_List", {
    name: "Incidents_V2_List",
    description: `List all incidents for an organisation.

This endpoint supports a number of filters, which can help find incidents matching certain
criteria.

Filters are provided as query parameters, but due to the dynamic nature of what you can
query by (different accounts have different custom fields, statuses, etc) they are more
complex than most.

The maximum page size that can be requested is 250.

To help, here are some exemplar curl requests with a human description of what they search
for.

Note that:
- Filters may be combined using the filter_mode parameter: 'all' (default) requires all filters
to match (AND logic), while 'any' requires at least one filter to match (OR logic).
- IDs are normally in UUID format, but have been replaced with shorter strings to improve
readability.
- All query parameters must be URI encoded.

### By status

With status of id=ABC, find all incidents that are set to that status:

\`\`\`bash
curl --get 'https://api.incident.io/v2/incidents' \\
--data 'status[one_of]=ABC'
\`\`\`

Or all incidents that are not set to status with id=ABC:

\`\`\`bash
curl --get 'https://api.incident.io/v2/incidents' \\
--data 'status[not_in]=ABC'
\`\`\`

### By created_at or updated_at

Find all incidents that follow specified date parameters for created_at and updated_at fields.
Possible values are "gte" (greater than or equal to), "lte" (less than or equal to), and
"date_range" (between two dates). The following example finds all incidents created before
or on 2021-01-02T00:00:00Z:

\`\`\`bash
curl --get 'https://api.incident.io/v2/incidents' \\
--data 'created_at[lte]=2021-01-02'
\`\`\`

To find incidents created within a specific date range, use the date_range option with
tilde-separated dates:

\`\`\`bash
curl --get 'https://api.incident.io/v2/incidents' \\
--data 'created_at[date_range]=2024-12-02~2024-12-08'
\`\`\`

### By status category

Find all incidents that are in a status category. Possible values are "triage",
"declined", "merged", "canceled", "live", "learning" and "closed":

\`\`\`bash
curl --get 'https://api.incident.io/v2/incidents' \\
--data 'status_category[one_of]=live'
\`\`\`

Or all incidents that are not in a status category:

\`\`\`bash
curl --get 'https://api.incident.io/v2/incidents' \\
--data 'status_category[not_in]=live'
\`\`\`


### By severity

With severity of id=ABC, find all incidents that are set to that severity:

\`\`\`bash
curl --get 'https://api.incident.io/v2/incidents' \\
--data 'severity[one_of]=ABC'
\`\`\`

Or all incidents where severity rank is greater-than-or-equal-to the rank of severity
id=ABC:

\`\`\`bash
curl --get 'https://api.incident.io/v2/incidents' \\
--data 'severity[gte]=ABC'
\`\`\`

Or all incidents where severity rank is less-than-or-equal-to the rank of severity id=ABC:

\`\`\`bash
curl --get 'https://api.incident.io/v2/incidents' \\
--data 'severity[lte]=ABC'
\`\`\`

### By incident type

With incident type of id=ABC, find all incidents that are of that type:

\`\`\`bash
curl --get 'https://api.incident.io/v2/incidents' \\
--data 'incident_type[one_of]=ABC'
\`\`\`

Or all incidents not of that type:

\`\`\`bash
curl --get 'https://api.incident.io/v2/incidents' \\
--data 'incident_type[not_in]=ABC'
\`\`\`

### By incident mode

By default, we return standard and retrospective incidents. This means that test and
tutorial incidents are filtered out. To override this behaviour, you can use the
mode filter to specify which modes you want to get.

To find incidents of all modes:

\`\`\`bash
curl --get 'https://api.incident.io/v2/incidents' \\
--data 'mode[one_of]=standard&mode[one_of]=retrospective&mode[one_of]=test&mode[one_of]=tutorial'
\`\`\`

To find just test incidents:

\`\`\`bash
curl --get 'https://api.incident.io/v2/incidents' \\
--data 'mode[one_of]=test'
\`\`\`


### By incident role

Roles and custom fields have another nested layer in the query parameter, to account for
operations against any of the roles or custom fields created in the account.

With incident role id=ABC, find all incidents where that role is unset:

\`\`\`bash
curl --get 'https://api.incident.io/v2/incidents' \\
--data 'incident_role[ABC][is_set]=true'
\`\`\`

Or where the role has been set:

\`\`\`bash
curl --get 'https://api.incident.io/v2/incidents' \\
--data 'incident_role[ABC][is_set]=false'
\`\`\`

### By option custom fields

With an option custom field id=ABC, all incidents that have field ABC set to the custom
field option of id=XYZ:

\`\`\`bash
curl \\
--get 'https://api.incident.io/v2/incidents' \\
--data 'custom_field[ABC][one_of]=XYZ'
\`\`\`

Or all incidents that do not have custom field id=ABC set to option id=XYZ:

\`\`\`bash
curl \\
--get 'https://api.incident.io/v2/incidents' \\
--data 'custom_field[ABC][not_in]=XYZ'
\`\`\`

### Sorting

By default, results are ordered by their creation date. You can use the sort_by parameter
to reverse this order:

\`\`\`bash
curl \\
--get 'https://api.incident.io/v2/incidents' \\
--data 'sort_by=created_at_oldest_first'
\`\`\`

(Tags: Incidents V2)`,
    inputSchema: {"type":"object","properties":{"page_size":{"default":25,"description":"Integer number of records to return","format":"int64","maximum":500,"type":"number"},"after":{"description":"An incident's ID. This endpoint will return a list of incidents after this ID in relation to the API response order.","type":"string"},"sort_by":{"default":"created_at_newest_first","description":"What order to return results in.","enum":["created_at_newest_first","created_at_oldest_first"],"type":"string"},"filter_mode":{"description":"How to combine the filters: 'all' combines them with AND logic (all must match), 'any' combines them with OR logic (any can match). Defaults to 'all'.","enum":["all","any"],"type":"string"},"status":{"additionalProperties":{"example":["some_value"],"items":{"example":"some_value","type":"string"},"type":"array"},"description":"Filter on incident status. The accepted operators are 'one_of', or 'not_in'.","type":"object"},"status_category":{"additionalProperties":{"example":["some_value"],"items":{"example":"some_value","type":"string"},"type":"array"},"description":"Filter on the category of the incidents status. The accepted operators are 'one_of', or 'not_in'.","type":"object"},"created_at":{"additionalProperties":{"example":["some_value"],"items":{"example":"some_value","type":"string"},"type":"array"},"description":"Filter on incident created at timestamp. The accepted operators are 'gte', 'lte' and 'date_range'.","type":"object"},"updated_at":{"additionalProperties":{"example":["some_value"],"items":{"example":"some_value","type":"string"},"type":"array"},"description":"Filter on incident updated at timestamp. The accepted operators are 'gte', 'lte' and 'date_range'.","type":"object"},"severity":{"additionalProperties":{"example":["some_value"],"items":{"example":"some_value","type":"string"},"type":"array"},"description":"Filter on incident severity. The accepted operators are 'one_of', 'not_in', 'gte', 'lte'.","type":"object"},"incident_type":{"additionalProperties":{"example":["some_value"],"items":{"example":"some_value","type":"string"},"type":"array"},"description":"Filter on incident type. The accepted operators are 'one_of, or 'not_in'.","type":"object"},"incident_role":{"additionalProperties":{"additionalProperties":{"example":["value"],"items":{"example":"value","type":"string"},"type":"array"},"example":{"abc123":["value"]},"type":"object"},"description":"Filter on an incident role. Role ID should be sent, along with backlink attribute ID (if needed) followed by the operator and values. The accepted operators are 'one_of', 'is_blank'.","type":"object"},"custom_field":{"additionalProperties":{"additionalProperties":{"example":["value"],"items":{"example":"value","type":"string"},"type":"array"},"example":{"abc123":["value"]},"type":"object"},"description":"Filter on an incident custom field. Custom field ID should be sent, followed by the operator and values. Accepted operator will depend on the custom field type.","type":"object"},"mode":{"additionalProperties":{"example":["some_value"],"items":{"example":"some_value","type":"string"},"type":"array"},"description":"Filter on incident mode. The accepted operator is 'one_of'.  If this is not provided, this value defaults to `{\"one_of\": [\"standard\", \"retrospective\"] }`, meaning that test and tutorial incidents are not included.","type":"object"}}},
    method: "get",
    pathTemplate: "/v2/incidents",
    executionParameters: [{"name":"page_size","in":"query"},{"name":"after","in":"query"},{"name":"sort_by","in":"query"},{"name":"filter_mode","in":"query"},{"name":"status","in":"query"},{"name":"status_category","in":"query"},{"name":"created_at","in":"query"},{"name":"updated_at","in":"query"},{"name":"severity","in":"query"},{"name":"incident_type","in":"query"},{"name":"incident_role","in":"query"},{"name":"custom_field","in":"query"},{"name":"mode","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Incidents V2"],
    deprecated: false
  }],
  ["Incidents_V2_Create", {
    name: "Incidents_V2_Create",
    description: `Create a new incident.

Note that if the incident mode is set to "retrospective" then the new incident
will not be announced in Slack.

(Tags: Incidents V2)`,
    inputSchema: {"type":"object","properties":{"requestBody":{"properties":{"custom_field_entries":{"description":"Set the incident's custom fields to these values","items":{"properties":{"custom_field_id":{"description":"ID of the custom field this entry is linked against","type":"string"},"values":{"description":"List of values to associate with this entry. Use an empty array to unset the value of the custom field.","items":{"properties":{"id":{"description":"Unique identifier for the custom field value","type":"string"},"value_catalog_entry_id":{"description":"ID of the catalog entry. You can also use an ExternalID or an Alias of the catalog entry.","type":"string"},"value_link":{"description":"If the custom field type is 'link', this will contain the value assigned.","type":"string"},"value_numeric":{"description":"If the custom field type is 'numeric', this will contain the value assigned.","type":"string"},"value_option_id":{"description":"ID of the custom field option","type":"string"},"value_text":{"description":"If the custom field type is 'text', this will contain the value assigned.","type":"string"},"value_timestamp":{"description":"Deprecated: please use incident timestamp values instead","type":"string"}},"type":"object"},"type":"array"}},"required":["custom_field_id","values"],"type":"object"},"type":"array"},"idempotency_key":{"description":"Unique string used to de-duplicate incident create requests","type":"string"},"incident_role_assignments":{"description":"Assign incident roles to these people","items":{"properties":{"assignee":{"properties":{"email":{"description":"The user's email address, matching the email on their Slack account","type":"string"},"id":{"description":"The incident.io ID of a user","type":"string"},"slack_user_id":{"description":"The ID of the user's Slack account.","type":"string"}},"type":"object"},"incident_role_id":{"description":"Unique ID of an incident role. Note that the 'reporter' role can only be assigned when creating an incident.","type":"string"}},"required":["incident_role_id"],"type":"object"},"type":"array"},"incident_status_id":{"description":"Incident status to assign to the incident","type":"string"},"incident_timestamp_values":{"description":"Assign the incident's timestamps to these values","items":{"properties":{"incident_timestamp_id":{"description":"The id of the incident timestamp that this incident timestamp value is associated with.","type":"string"},"value":{"description":"The current value of this timestamp, for this incident","format":"date-time","type":"string"}},"required":["incident_timestamp_id"],"type":"object"},"type":"array"},"incident_type_id":{"description":"Incident type to create this incident as","type":"string"},"mode":{"description":"Whether the incident is real, a test, a tutorial, or importing as a retrospective incident","enum":["standard","retrospective","test","tutorial"],"type":"string"},"name":{"description":"Explanation of the incident","type":"string"},"retrospective_incident_options":{"properties":{"external_id":{"description":"The external ID (e.g. the 123 in INC-123) to assign to the incident. This can be useful when importing incidents. If you want to use this field, you'll need to talk to us first.","format":"int64","type":"number"},"postmortem_document_url":{"description":"The URL of the postmortem, if there is one","type":"string"},"slack_channel_id":{"description":"Pass the ID of a Slack channel to attach the incident to an existing channel, rather than creating a new one","type":"string"}},"type":"object"},"severity_id":{"description":"Severity to create incident as","type":"string"},"slack_channel_name_override":{"description":"Name of the Slack channel to create for this incident","type":"string"},"slack_team_id":{"description":"Slack Team to create the incident in","type":"string"},"summary":{"description":"Detailed description of the incident","type":"string"},"visibility":{"description":"Whether the incident should be open to anyone in your Slack workspace (public), or invite-only (private). For more information on Private Incidents see our [docs](https://docs.incident.io/incidents/sensitive-incidents).","enum":["public","private"],"type":"string"}},"required":["idempotency_key","visibility"],"type":"object","description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/v2/incidents",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Incidents V2"],
    deprecated: false
  }],
  ["Incidents_V2_Show", {
    name: "Incidents_V2_Show",
    description: `Get a single incident.

The ID supplied can be either the incident's full ID, or the numeric part of its
reference. For example, to get INC-123, you could use either its full ID or:

\`\`\`bash
curl \\
--get 'https://api.incident.io/v2/incidents/123
\`\`\`

(Tags: Incidents V2)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"Unique identifier for the incident","type":"string"}},"required":["id"]},
    method: "get",
    pathTemplate: "/v2/incidents/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Incidents V2"],
    deprecated: false
  }],
  ["Incidents_V2_Edit", {
    name: "Incidents_V2_Edit",
    description: `Edit an existing incident.

This endpoint allows you to edit the properties of an existing incident: e.g. set the severity or update custom fields.

When using this endpoint, only fields that are provided will be edited (omitted fields
will be ignored).

(Tags: Incidents V2)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"The unique identifier of the incident that you want to edit","type":"string"},"requestBody":{"properties":{"incident":{"properties":{"call_url":{"description":"The call URL attached to this incident","type":"string"},"custom_field_entries":{"description":"Set the incident's custom fields to these values","items":{"properties":{"custom_field_id":{"description":"ID of the custom field this entry is linked against","type":"string"},"values":{"description":"List of values to associate with this entry. Use an empty array to unset the value of the custom field.","items":{"properties":{"id":{"description":"Unique identifier for the custom field value","type":"string"},"value_catalog_entry_id":{"description":"ID of the catalog entry. You can also use an ExternalID or an Alias of the catalog entry.","type":"string"},"value_link":{"description":"If the custom field type is 'link', this will contain the value assigned.","type":"string"},"value_numeric":{"description":"If the custom field type is 'numeric', this will contain the value assigned.","type":"string"},"value_option_id":{"description":"ID of the custom field option","type":"string"},"value_text":{"description":"If the custom field type is 'text', this will contain the value assigned.","type":"string"},"value_timestamp":{"description":"Deprecated: please use incident timestamp values instead","type":"string"}},"type":"object"},"type":"array"}},"required":["custom_field_id","values"],"type":"object"},"type":"array"},"incident_role_assignments":{"description":"Assign incident roles to these people","items":{"properties":{"assignee":{"properties":{"email":{"description":"The user's email address, matching the email on their Slack account","type":"string"},"id":{"description":"The incident.io ID of a user","type":"string"},"slack_user_id":{"description":"The ID of the user's Slack account.","type":"string"}},"type":"object"},"incident_role_id":{"description":"Unique ID of an incident role. Note that the 'reporter' role can only be assigned when creating an incident.","type":"string"}},"required":["incident_role_id"],"type":"object"},"type":"array"},"incident_status_id":{"description":"Incident status to change incident to. You can only change an incident from one active status to another, or close an incident from a post-incident status. Any other lifecycle changes must be taken via the app.","type":"string"},"incident_timestamp_values":{"description":"Assign the incident's timestamps to these values","items":{"properties":{"incident_timestamp_id":{"description":"The id of the incident timestamp that this incident timestamp value is associated with.","type":"string"},"value":{"description":"The current value of this timestamp, for this incident","format":"date-time","type":"string"}},"required":["incident_timestamp_id"],"type":"object"},"type":"array"},"name":{"description":"Explanation of the incident","type":"string"},"severity_id":{"description":"The ID of the current severity of this incident","type":"string"},"slack_channel_name_override":{"description":"Override the name of the incident Slack channel","type":"string"},"summary":{"description":"Detailed description of the incident","type":"string"}},"type":"object"},"notify_incident_channel":{"description":"Should we send Slack channel notifications to inform responders of this update? Note that this won't work if the Slack channel has already been archived.","type":"boolean"}},"required":["incident","notify_incident_channel"],"type":"object","description":"The JSON request body."}},"required":["id","requestBody"]},
    method: "post",
    pathTemplate: "/v2/incidents/{id}/actions/edit",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Incidents V2"],
    deprecated: false
  }],
  ["Schedules_V2_ListScheduleEntries", {
    name: "Schedules_V2_ListScheduleEntries",
    description: `Get a list of schedule entries. The endpoint will return all entries that overlap with the given window, if one is provided.
(Tags: Schedules V2)`,
    inputSchema: {"type":"object","properties":{"schedule_id":{"description":"The ID of the schedule to get entries for.","type":"string"},"entry_window_start":{"description":"The start of the window to get entries for.","format":"date-time","type":"string"},"entry_window_end":{"description":"The end of the window to get entries for.","format":"date-time","type":"string"}},"required":["schedule_id"]},
    method: "get",
    pathTemplate: "/v2/schedule_entries",
    executionParameters: [{"name":"schedule_id","in":"query"},{"name":"entry_window_start","in":"query"},{"name":"entry_window_end","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Schedules V2"],
    deprecated: false
  }],
  ["Schedules_V2_CreateOverride", {
    name: "Schedules_V2_CreateOverride",
    description: `Create a new schedule override.
(Tags: Schedules V2)`,
    inputSchema: {"type":"object","properties":{"requestBody":{"properties":{"end_at":{"description":"End time of the override","format":"date-time","type":"string"},"layer_id":{"description":"The layer this override applies to","type":"string"},"rotation_id":{"description":"The rotation this override applies to","type":"string"},"schedule_id":{"description":"The schedule this override applies to","type":"string"},"start_at":{"description":"Start time of the override","format":"date-time","type":"string"},"user":{"properties":{"email":{"description":"The user's email address, matching the email on their Slack account","type":"string"},"id":{"description":"The incident.io ID of a user","type":"string"},"slack_user_id":{"description":"The ID of the user's Slack account.","type":"string"}},"type":"object"}},"required":["start_at","end_at","schedule_id","rotation_id","layer_id","user"],"type":"object","description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/v2/schedule_overrides",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Schedules V2"],
    deprecated: false
  }],
  ["Schedules_V2_List", {
    name: "Schedules_V2_List",
    description: `List configured schedules.
(Tags: Schedules V2)`,
    inputSchema: {"type":"object","properties":{"page_size":{"default":25,"description":"Integer number of records to return","format":"int64","maximum":10000,"type":"number"},"after":{"description":"A schedule's ID. This endpoint will return a list of schedules after this ID in relation to the API response order.","type":"string"}}},
    method: "get",
    pathTemplate: "/v2/schedules",
    executionParameters: [{"name":"page_size","in":"query"},{"name":"after","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Schedules V2"],
    deprecated: false
  }],
  ["Schedules_V2_Create", {
    name: "Schedules_V2_Create",
    description: `Create a new schedule.
(Tags: Schedules V2)`,
    inputSchema: {"type":"object","properties":{"requestBody":{"properties":{"schedule":{"properties":{"annotations":{"additionalProperties":{"example":"abc123","type":"string"},"description":"Annotations that can track metadata about the schedule","type":"object"},"config":{"properties":{"rotations":{"items":{"properties":{"effective_from":{"format":"date-time","type":"string"},"handover_start_at":{"format":"date-time","type":"string"},"handovers":{"items":{"properties":{"interval":{"format":"int64","type":"number"},"interval_type":{"description":"How often a handover occurs","enum":["hourly","daily","weekly"],"type":"string","x-public-api-version":"v2"}},"type":"object"},"type":"array"},"id":{"description":"Unique identifier of the rotation","type":"string"},"layers":{"items":{"properties":{"id":{"description":"Unique identifier of the layer","type":"string"},"name":{"description":"Name of the layer","type":"string"}},"required":["name"],"type":"object"},"type":"array"},"name":{"description":"Name of the rotation","type":"string"},"scheduling_mode":{"description":"Scheduling algorithm to use for this rotation. 'fair' balances workload by considering handover duration, while 'sequential' uses simple round-robin rotation through users. Only applies when you have asymmetric handovers (e.g., 2 days then 5 days).","enum":["fair","sequential"],"type":"string"},"users":{"items":{"properties":{"email":{"description":"The user's email address, matching the email on their Slack account","type":"string"},"id":{"description":"The incident.io ID of a user","type":"string"},"slack_user_id":{"description":"The ID of the user's Slack account.","type":"string"}},"type":"object"},"type":"array"},"working_interval":{"description":"DEPRECATED: Use working_intervals instead.","items":{"properties":{"end_time":{"description":"End time of the interval, in 24hr format","type":"string"},"start_time":{"description":"Start time of the interval, in 24hr format","type":"string"},"weekday":{"description":"Weekdays for use with a schedule","enum":["monday","tuesday","wednesday","thursday","friday","saturday","sunday"],"type":"string","x-public-api-version":"v2"}},"required":["weekday","start_time","end_time"],"type":"object"},"type":"array"},"working_intervals":{"items":{"properties":{"end_time":{"description":"End time of the interval, in 24hr format","type":"string"},"start_time":{"description":"Start time of the interval, in 24hr format","type":"string"},"weekday":{"description":"Weekdays for use with a schedule","enum":["monday","tuesday","wednesday","thursday","friday","saturday","sunday"],"type":"string","x-public-api-version":"v2"}},"required":["weekday","start_time","end_time"],"type":"object"},"type":"array"}},"required":["name"],"type":"object"},"type":"array"}},"type":"object"},"holidays_public_config":{"properties":{"country_codes":{"description":"ISO 3166-1 alpha-2 country codes for the countries that this schedule is configured to view holidays for","items":{"type":"string"},"type":"array"}},"required":["country_codes"],"type":"object"},"name":{"description":"Name of the schedule","type":"string"},"team_ids":{"description":"IDs of teams that own this schedule","items":{"type":"string"},"type":"array"},"timezone":{"description":"Timezone of the schedule","type":"string"}},"type":"object"}},"required":["schedule"],"type":"object","description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/v2/schedules",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Schedules V2"],
    deprecated: false
  }],
  ["Schedules_V2_Show", {
    name: "Schedules_V2_Show",
    description: `Get a single schedule.
(Tags: Schedules V2)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"Unique internal ID of the schedule","type":"string"}},"required":["id"]},
    method: "get",
    pathTemplate: "/v2/schedules/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Schedules V2"],
    deprecated: false
  }],
  ["Schedules_V2_Update", {
    name: "Schedules_V2_Update",
    description: `Update a schedule.
(Tags: Schedules V2)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"The schedule ID to update.","type":"string"},"requestBody":{"properties":{"schedule":{"properties":{"annotations":{"additionalProperties":{"example":"abc123","type":"string"},"description":"Annotations that can track metadata about the schedule","type":"object"},"config":{"properties":{"rotations":{"items":{"properties":{"effective_from":{"format":"date-time","type":"string"},"handover_start_at":{"format":"date-time","type":"string"},"handovers":{"items":{"properties":{"interval":{"format":"int64","type":"number"},"interval_type":{"description":"How often a handover occurs","enum":["hourly","daily","weekly"],"type":"string","x-public-api-version":"v2"}},"type":"object"},"type":"array"},"id":{"description":"Unique identifier of the rotation","type":"string"},"layers":{"items":{"properties":{"id":{"description":"Unique identifier of the layer","type":"string"},"name":{"description":"Name of the layer","type":"string"}},"type":"object"},"type":"array"},"name":{"description":"Name of the rotation","type":"string"},"scheduling_mode":{"description":"Scheduling algorithm to use for this rotation. 'fair' balances workload by considering handover duration, while 'sequential' uses simple round-robin rotation through users. Only applies when you have asymmetric handovers (e.g., 2 days then 5 days).","enum":["fair","sequential"],"type":"string"},"users":{"items":{"properties":{"email":{"description":"The user's email address, matching the email on their Slack account","type":"string"},"id":{"description":"The incident.io ID of a user","type":"string"},"slack_user_id":{"description":"The ID of the user's Slack account.","type":"string"}},"type":"object"},"type":"array"},"working_interval":{"description":"DEPRECATED: Use working_intervals instead.","items":{"properties":{"end_time":{"description":"End time of the interval, in 24hr format","type":"string"},"start_time":{"description":"Start time of the interval, in 24hr format","type":"string"},"weekday":{"description":"Weekdays for use with a schedule","enum":["monday","tuesday","wednesday","thursday","friday","saturday","sunday"],"type":"string","x-public-api-version":"v2"}},"required":["weekday","start_time","end_time"],"type":"object"},"type":"array"},"working_intervals":{"items":{"properties":{"end_time":{"description":"End time of the interval, in 24hr format","type":"string"},"start_time":{"description":"Start time of the interval, in 24hr format","type":"string"},"weekday":{"description":"Weekdays for use with a schedule","enum":["monday","tuesday","wednesday","thursday","friday","saturday","sunday"],"type":"string","x-public-api-version":"v2"}},"required":["weekday","start_time","end_time"],"type":"object"},"type":"array"}},"type":"object"},"type":"array"}},"type":"object"},"holidays_public_config":{"properties":{"country_codes":{"description":"ISO 3166-1 alpha-2 country codes for the countries that this schedule is configured to view holidays for","items":{"type":"string"},"type":"array"}},"required":["country_codes"],"type":"object"},"name":{"description":"Name of the schedule","type":"string"},"team_ids":{"description":"IDs of teams that own this schedule","items":{"type":"string"},"type":"array"},"timezone":{"description":"Timezone of the schedule","type":"string"}},"type":"object"}},"required":["schedule"],"type":"object","description":"The JSON request body."}},"required":["id","requestBody"]},
    method: "put",
    pathTemplate: "/v2/schedules/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Schedules V2"],
    deprecated: false
  }],
  ["Schedules_V2_Destroy", {
    name: "Schedules_V2_Destroy",
    description: `Archives a single schedule.
(Tags: Schedules V2)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"Unique internal ID of the schedule","type":"string"}},"required":["id"]},
    method: "delete",
    pathTemplate: "/v2/schedules/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Schedules V2"],
    deprecated: false
  }],
  ["Status_Pages_V2_CreateStatusPageIncidentUpdate", {
    name: "Status_Pages_V2_CreateStatusPageIncidentUpdate",
    description: `Post an update on a Status Page incident.

This is the endpoint to use when resolving an incident - set incident_status to "resolved" to end the incident. There is a limit of 100 updates per incident.

This endpoint requires an API key with the "Create status page incidents, maintenance windows and publish updates" scope.
(Tags: Status Pages V2)`,
    inputSchema: {"type":"object","properties":{"requestBody":{"properties":{"component_statuses":{"description":"An array of mappings from component ID to component status. This must not be set if the status page incident status is being set to \"resolved\", as all components statuses will update to \"operational\".","items":{"properties":{"component_id":{"description":"The ID of the affected component. This may be found by calling the ShowStatusPageStructure endpoint.","type":"string"},"component_status":{"description":"The status of the relevant component in a status page incident","enum":["operational","degraded_performance","partial_outage","full_outage"],"type":"string","x-public-api-version":"v2"}},"required":["component_id","component_status"],"type":"object"},"type":"array"},"incident_status":{"description":"Optional new status for this status page incident. If not provided, the status will remain unchanged. Setting to \"resolved\" will end the incident and all component statuses will update to \"operational\".","enum":["investigating","identified","monitoring","resolved"],"type":"string"},"message":{"description":"Markdown update on what's changed about this status page incident","maxLength":4096,"type":"string"},"notify_subscribers":{"description":"Whether to notify subscribers about this incident update. This will not work if your status page has more than 1000 subscribers.","type":"boolean"},"status_page_incident_id":{"description":"ID of the status page incident","type":"string"}},"required":["status_page_incident_id","message","notify_subscribers"],"type":"object","description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/v2/status_page_incident_updates",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Status Pages V2"],
    deprecated: false
  }],
  ["Status_Pages_V2_ListStatusPageIncidents", {
    name: "Status_Pages_V2_ListStatusPageIncidents",
    description: `List status page incidents.

This endpoint requires a valid API key but no specific scopes.
(Tags: Status Pages V2)`,
    inputSchema: {"type":"object","properties":{"status_page_id":{"description":"ID of the status page. You can find this by calling the ListStatusPages endpoint.","type":"string"},"component_id":{"description":"Filter status page incidents to only those that impacted the specified component. This ID may be found by calling the ShowStatusPageStructure endpoint.","type":"string"},"group_id":{"description":"Filter status page incidents to only those that impacted components in the specified group. This ID may be found by calling the ShowStatusPageStructure endpoint.","type":"string"},"sub_page_id":{"description":"Filter status page incidents to only those that impacted the specified sub-page. This ID may be found by calling the ShowStatusPageStructure endpoint.","type":"string"},"start_at":{"description":"Filter status page incidents to only those that had impacts during or after this time.","format":"date-time","type":"string"},"end_at":{"description":"Filter status page incidents to only those that had impacts during or before this time.","format":"date-time","type":"string"},"page_size":{"default":25,"description":"Integer number of records to return","format":"int64","maximum":250,"type":"number"},"after":{"description":"An record's ID. This endpoint will return a list of records after this ID in relation to the API response order.","type":"string"}},"required":["status_page_id"]},
    method: "get",
    pathTemplate: "/v2/status_page_incidents",
    executionParameters: [{"name":"status_page_id","in":"query"},{"name":"component_id","in":"query"},{"name":"group_id","in":"query"},{"name":"sub_page_id","in":"query"},{"name":"start_at","in":"query"},{"name":"end_at","in":"query"},{"name":"page_size","in":"query"},{"name":"after","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Status Pages V2"],
    deprecated: false
  }],
  ["Status_Pages_V2_CreateStatusPageIncident", {
    name: "Status_Pages_V2_CreateStatusPageIncident",
    description: `Create a status page incident.

This endpoint requires an API key with the "Create status page incidents, maintenance windows and publish updates" scope.
(Tags: Status Pages V2)`,
    inputSchema: {"type":"object","properties":{"requestBody":{"properties":{"component_statuses":{"description":"An array of mappings from component ID to current component status","items":{"properties":{"component_id":{"description":"The ID of the affected component. This may be found by calling the ShowStatusPageStructure endpoint.","type":"string"},"component_status":{"description":"The status of the relevant component in a status page incident","enum":["operational","degraded_performance","partial_outage","full_outage"],"type":"string","x-public-api-version":"v2"}},"required":["component_id","component_status"],"type":"object"},"type":"array"},"idempotency_key":{"description":"A unique key to de-duplicate requests. If you send a request with an idempotency_key that was already used, the original response will be returned.","type":"string"},"incident_status":{"description":"Current status for this status page incident","enum":["investigating","identified","monitoring","resolved"],"type":"string"},"message":{"description":"Markdown initial update on this status page incident","maxLength":4096,"type":"string"},"name":{"description":"A title for the incident","maxLength":200,"type":"string"},"notify_subscribers":{"description":"Whether to notify subscribers about this status page incident. This will not work if your status page has more than 1000 subscribers.","type":"boolean"},"status_page_id":{"description":"ID of the status page. You can find this by calling the ListStatusPages endpoint.","type":"string"}},"required":["status_page_id","name","incident_status","idempotency_key","message","notify_subscribers"],"type":"object","description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/v2/status_page_incidents",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Status Pages V2"],
    deprecated: false
  }],
  ["Status_Pages_V2_ShowStatusPageIncident", {
    name: "Status_Pages_V2_ShowStatusPageIncident",
    description: `Show a status page incident.

This endpoint requires a valid API key but no specific scopes.
(Tags: Status Pages V2)`,
    inputSchema: {"type":"object","properties":{"status_page_incident_id":{"description":"ID of the status page incident","type":"string"}},"required":["status_page_incident_id"]},
    method: "get",
    pathTemplate: "/v2/status_page_incidents/{status_page_incident_id}",
    executionParameters: [{"name":"status_page_incident_id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Status Pages V2"],
    deprecated: false
  }],
  ["Status_Pages_V2_UpdateStatusPageIncident", {
    name: "Status_Pages_V2_UpdateStatusPageIncident",
    description: `Update a status page incident.

This endpoint requires an API key with the "Create status page incidents, maintenance windows and publish updates" scope.
(Tags: Status Pages V2)`,
    inputSchema: {"type":"object","properties":{"status_page_incident_id":{"description":"ID of the status page incident","type":"string"},"requestBody":{"properties":{"name":{"description":"A title for the incident","maxLength":200,"type":"string"}},"required":["name"],"type":"object","description":"The JSON request body."}},"required":["status_page_incident_id","requestBody"]},
    method: "put",
    pathTemplate: "/v2/status_page_incidents/{status_page_incident_id}",
    executionParameters: [{"name":"status_page_incident_id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Status Pages V2"],
    deprecated: false
  }],
  ["Status_Pages_V2_CreateStatusPageMaintenanceUpdate", {
    name: "Status_Pages_V2_CreateStatusPageMaintenanceUpdate",
    description: `Post an update on a Status Page maintenance window.

This is the endpoint to use when completing a maintenance window - set maintenance_status to "maintenance_complete" to end the maintenance. There is a limit of 100 updates per maintenance window.

This endpoint requires an API key with the "Create status page incidents, maintenance windows and publish updates" scope.
(Tags: Status Pages V2)`,
    inputSchema: {"type":"object","properties":{"requestBody":{"properties":{"component_statuses":{"description":"An array of mappings from component ID to component status. This must not be set if the status page maintenance window status is being set to \"maintenance_complete\", as all components statuses will update to \"operational\".","items":{"properties":{"component_id":{"description":"The ID of the affected component. This may be found by calling the ShowStatusPageStructure endpoint.","type":"string"},"component_status":{"description":"The status of the relevant component in a status page maintenance window","enum":["operational","under_maintenance"],"type":"string","x-public-api-version":"v2"}},"required":["component_id","component_status"],"type":"object"},"type":"array"},"maintenance_status":{"description":"Optional new status for this status page maintenance window. If not provided, the status will remain unchanged. Setting to \"maintenance_complete\" will end the maintenance window and all component statuses will update to \"operational\".","enum":["maintenance_scheduled","maintenance_in_progress","maintenance_complete"],"type":"string"},"message":{"description":"Markdown update on what's changed about this status page maintenance window","maxLength":4096,"type":"string"},"notify_subscribers":{"description":"Whether to notify subscribers about this status page maintenance update. This will not work if your status page has more than 1000 subscribers.","type":"boolean"},"status_page_maintenance_id":{"description":"ID of the status page maintenance window","type":"string"}},"required":["status_page_maintenance_id","message","notify_subscribers"],"type":"object","description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/v2/status_page_maintenance_updates",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Status Pages V2"],
    deprecated: false
  }],
  ["Status_Pages_V2_ListStatusPageMaintenances", {
    name: "Status_Pages_V2_ListStatusPageMaintenances",
    description: `List status page maintenances.

This endpoint requires a valid API key but no specific scopes.
(Tags: Status Pages V2)`,
    inputSchema: {"type":"object","properties":{"status_page_id":{"description":"ID of the status page. You can find this by calling the ListStatusPages endpoint.","type":"string"},"component_id":{"description":"Filter status page maintenance windows to only those that impacted the specified component. This ID may be found by calling the ShowStatusPageStructure endpoint.","type":"string"},"group_id":{"description":"Filter status page maintenance windows to only those that impacted components in the specified group. This ID may be found by calling the ShowStatusPageStructure endpoint.","type":"string"},"sub_page_id":{"description":"Filter status page maintenance windows to only those that impacted the specified sub-page. This ID may be found by calling the ShowStatusPageStructure endpoint.","type":"string"},"start_at":{"description":"Filter status page maintenance windows to only those that had impacts during or after this time.","format":"date-time","type":"string"},"end_at":{"description":"Filter status page maintenance windows to only those that had impacts during or before this time.","format":"date-time","type":"string"},"page_size":{"default":25,"description":"Integer number of records to return","format":"int64","maximum":250,"type":"number"},"after":{"description":"An record's ID. This endpoint will return a list of records after this ID in relation to the API response order.","type":"string"}},"required":["status_page_id"]},
    method: "get",
    pathTemplate: "/v2/status_page_maintenances",
    executionParameters: [{"name":"status_page_id","in":"query"},{"name":"component_id","in":"query"},{"name":"group_id","in":"query"},{"name":"sub_page_id","in":"query"},{"name":"start_at","in":"query"},{"name":"end_at","in":"query"},{"name":"page_size","in":"query"},{"name":"after","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Status Pages V2"],
    deprecated: false
  }],
  ["Status_Pages_V2_CreateStatusPageMaintenance", {
    name: "Status_Pages_V2_CreateStatusPageMaintenance",
    description: `Schedule a Status Page maintenance window.

This endpoint requires an API key with the "Create status page incidents, maintenance windows and publish updates" scope.
(Tags: Status Pages V2)`,
    inputSchema: {"type":"object","properties":{"requestBody":{"properties":{"affected_component_ids":{"description":"An array of IDs of component affected by the maintenance window","items":{"type":"string"},"type":"array"},"end_at":{"description":"The time the maintenance window ends","format":"date-time","type":"string"},"idempotency_key":{"description":"A unique key to de-duplicate requests. If you send a request with an idempotency_key that was already used, the original response will be returned.","type":"string"},"maintenance_status":{"description":"Current status for this status page maintenance window","enum":["maintenance_scheduled","maintenance_in_progress","maintenance_complete"],"type":"string"},"message":{"description":"Markdown initial update on this status page maintenance window","maxLength":4096,"type":"string"},"name":{"description":"A title for the maintenance window","maxLength":200,"type":"string"},"notify_subscribers":{"description":"Whether to notify subscribers about this status page maintenance. This will not work if your status page has more than 1000 subscribers.","type":"boolean"},"start_at":{"description":"The time the maintenance window starts","format":"date-time","type":"string"},"status_page_id":{"description":"ID of the status page. You can find this by calling the ListStatusPages endpoint.","type":"string"}},"required":["status_page_id","name","maintenance_status","idempotency_key","affected_component_ids","start_at","end_at","message","notify_subscribers"],"type":"object","description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/v2/status_page_maintenances",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Status Pages V2"],
    deprecated: false
  }],
  ["Status_Pages_V2_ShowStatusPageMaintenance", {
    name: "Status_Pages_V2_ShowStatusPageMaintenance",
    description: `Show a status page maintenance window.

This endpoint requires a valid API key but no specific scopes.
(Tags: Status Pages V2)`,
    inputSchema: {"type":"object","properties":{"status_page_maintenance_id":{"description":"ID of the status page maintenance window","type":"string"}},"required":["status_page_maintenance_id"]},
    method: "get",
    pathTemplate: "/v2/status_page_maintenances/{status_page_maintenance_id}",
    executionParameters: [{"name":"status_page_maintenance_id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Status Pages V2"],
    deprecated: false
  }],
  ["Status_Pages_V2_ShowStatusPageStructure", {
    name: "Status_Pages_V2_ShowStatusPageStructure",
    description: `Show the structure of a status page.

This endpoint requires a valid API key but no specific scopes. Returns the components and component groups configured on a status page. Use this to find component IDs when specifying affected components for incidents or maintenance windows.
(Tags: Status Pages V2)`,
    inputSchema: {"type":"object","properties":{"status_page_id":{"description":"ID of the status page","type":"string"}},"required":["status_page_id"]},
    method: "get",
    pathTemplate: "/v2/status_page_structures/{status_page_id}",
    executionParameters: [{"name":"status_page_id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Status Pages V2"],
    deprecated: false
  }],
  ["Status_Pages_V2_ListStatusPages", {
    name: "Status_Pages_V2_ListStatusPages",
    description: `List all status pages for your organisation.

This endpoint requires a valid API key but no specific scopes. Use this to find status page IDs for use in other endpoints.
(Tags: Status Pages V2)`,
    inputSchema: {"type":"object","properties":{"page_size":{"default":25,"description":"Integer number of records to return","format":"int64","maximum":250,"type":"number"},"after":{"description":"An record's ID. This endpoint will return a list of records after this ID in relation to the API response order.","type":"string"}}},
    method: "get",
    pathTemplate: "/v2/status_pages",
    executionParameters: [{"name":"page_size","in":"query"},{"name":"after","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Status Pages V2"],
    deprecated: false
  }],
  ["Users_V2_List", {
    name: "Users_V2_List",
    description: `List users in your account.
(Tags: Users V2)`,
    inputSchema: {"type":"object","properties":{"email":{"description":"Filter by email address","type":"string"},"slack_user_id":{"description":"Filter by Slack user ID","type":"string"},"page_size":{"default":25,"description":"Integer number of records to return","format":"int64","maximum":10000,"type":"number"},"after":{"description":"An record's ID. This endpoint will return a list of records after this ID in relation to the API response order.","type":"string"}}},
    method: "get",
    pathTemplate: "/v2/users",
    executionParameters: [{"name":"email","in":"query"},{"name":"slack_user_id","in":"query"},{"name":"page_size","in":"query"},{"name":"after","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Users V2"],
    deprecated: false
  }],
  ["Users_V2_Show", {
    name: "Users_V2_Show",
    description: `Get a single user.
(Tags: Users V2)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"Unique identifier of the user","type":"string"}},"required":["id"]},
    method: "get",
    pathTemplate: "/v2/users/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Users V2"],
    deprecated: false
  }],
  ["Workflows_V2_ListWorkflows", {
    name: "Workflows_V2_ListWorkflows",
    description: `List all workflows
(Tags: Workflows V2)`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/v2/workflows",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Workflows V2"],
    deprecated: false
  }],
  ["Workflows_V2_CreateWorkflow", {
    name: "Workflows_V2_CreateWorkflow",
    description: `Create a new workflow
(Tags: Workflows V2)`,
    inputSchema: {"type":"object","properties":{"requestBody":{"properties":{"annotations":{"additionalProperties":{"example":"abc123","type":"string"},"description":"Annotations that track metadata about this resource","type":"object"},"condition_groups":{"description":"Conditions that apply to the workflow trigger","items":{"properties":{"conditions":{"description":"All conditions in this list must be satisfied for the group to be satisfied","items":{"properties":{"operation":{"description":"The name of the operation on the subject","type":"string"},"param_bindings":{"description":"List of parameter bindings","items":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"},"type":"array"},"subject":{"description":"The reference of the subject in the trigger scope","type":"string"}},"required":["subject","operation","param_bindings"],"type":"object"},"type":"array"}},"required":["conditions"],"type":"object"},"type":"array"},"continue_on_step_error":{"description":"Whether to continue executing the workflow if a step fails","type":"boolean"},"delay":{"properties":{"conditions_apply_over_delay":{"description":"If this workflow is delayed, whether the conditions should be rechecked between trigger firing and execution","type":"boolean"},"for_seconds":{"description":"Delay in seconds between trigger firing and running the workflow","format":"int64","type":"number"}},"required":["for_seconds","conditions_apply_over_delay"],"type":"object"},"expressions":{"description":"The expressions to use in the workflow","items":{"properties":{"else_branch":{"properties":{"result":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"}},"required":["result"],"type":"object"},"label":{"description":"The human readable label of the expression","type":"string"},"operations":{"items":{"properties":{"branches":{"properties":{"branches":{"description":"The branches to apply for this operation","items":{"properties":{"condition_groups":{"description":"When one of these condition groups are satisfied, this branch will be evaluated","items":{"properties":{"conditions":{"description":"All conditions in this list must be satisfied for the group to be satisfied","items":{"properties":{"operation":{"description":"The name of the operation on the subject","type":"string"},"param_bindings":{"description":"List of parameter bindings","items":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"},"type":"array"},"subject":{"description":"The reference of the subject in the trigger scope","type":"string"}},"required":["subject","operation","param_bindings"],"type":"object"},"type":"array"}},"required":["conditions"],"type":"object"},"type":"array"},"result":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"}},"required":["condition_groups","result"],"type":"object"},"type":"array"},"returns":{"properties":{"array":{"description":"Whether the return value should be single or multi-value","type":"boolean"},"type":{"description":"Expected return type of this expression (what to try casting the result to)","type":"string"}},"required":["type","array"],"type":"object"}},"required":["branches","returns"],"type":"object"},"concatenate":{"properties":{"reference":{"description":"The reference that you want to concatenate with","type":"string"}},"required":["reference"],"type":"object"},"filter":{"properties":{"condition_groups":{"description":"The condition groups to apply in this filter. Only one group needs to be satisfied for the filter to pass.","items":{"properties":{"conditions":{"description":"All conditions in this list must be satisfied for the group to be satisfied","items":{"properties":{"operation":{"description":"The name of the operation on the subject","type":"string"},"param_bindings":{"description":"List of parameter bindings","items":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"},"type":"array"},"subject":{"description":"The reference of the subject in the trigger scope","type":"string"}},"required":["subject","operation","param_bindings"],"type":"object"},"type":"array"}},"required":["conditions"],"type":"object"},"type":"array"}},"required":["condition_groups"],"type":"object"},"navigate":{"properties":{"reference":{"description":"The reference that you want to navigate to","type":"string"}},"required":["reference"],"type":"object"},"operation_type":{"description":"The type of the operation","enum":["navigate","filter","concatenate","count","min","max","sum","random","first","parse","branches"],"type":"string"},"parse":{"properties":{"returns":{"properties":{"array":{"description":"Whether the return value should be single or multi-value","type":"boolean"},"type":{"description":"Expected return type of this expression (what to try casting the result to)","type":"string"}},"required":["type","array"],"type":"object"},"source":{"description":"Source expression that is evaluated to a result","type":"string"}},"required":["source","returns"],"type":"object"}},"required":["operation_type"],"type":"object"},"type":"array"},"reference":{"description":"A short ID that can be used to reference the expression","type":"string"},"root_reference":{"description":"The root reference for this expression (i.e. where the expression starts)","type":"string"}},"required":["label","reference","root_reference","operations"],"type":"object"},"type":"array"},"folder":{"description":"Folder to display the workflow in","type":"string"},"include_private_escalations":{"description":"Whether to include private escalations","type":"boolean"},"include_private_incidents":{"description":"Whether to include private incidents","type":"boolean"},"name":{"description":"Name provided by the user when creating the workflow","type":"string"},"once_for":{"description":"This workflow will run 'once for' a list of references","items":{"type":"string"},"type":"array"},"runs_on_incident_modes":{"description":"Which incident modes should this workflow run on? By default, workflows only run on standard incidents, but can also be configured to run on test and retrospective incidents.","items":{"enum":["standard","test","retrospective"],"type":"string"},"type":"array"},"runs_on_incidents":{"description":"Which incidents should the workflow be applied to?","enum":["newly_created","newly_created_and_active"],"type":"string"},"shortform":{"description":"The shortform used to trigger this workflow (only applicable for manual triggers)","type":"string"},"state":{"description":"What state this workflow is in","enum":["active","disabled","draft","error"],"type":"string"},"steps":{"description":"Steps that are executed as part of the workflow","items":{"properties":{"for_each":{"description":"Reference to an expression that returns resources to run this step over","type":"string"},"id":{"description":"Unique ID of this step in a workflow","type":"string"},"name":{"description":"Unique name of the step in the engine","type":"string"},"param_bindings":{"description":"List of parameter bindings","items":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"},"type":"array"}},"required":["id","name","param_bindings"],"type":"object"},"type":"array"},"trigger":{"description":"Trigger to set on the workflow","type":"string"}},"required":["name","trigger","once_for","condition_groups","steps","expressions","include_private_incidents","runs_on_incident_modes","continue_on_step_error","runs_on_incidents"],"type":"object","description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/v2/workflows",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Workflows V2"],
    deprecated: false
  }],
  ["Workflows_V2_ShowWorkflow", {
    name: "Workflows_V2_ShowWorkflow",
    description: `Show a workflow by ID
(Tags: Workflows V2)`,
    inputSchema: {"type":"object","properties":{"skip_step_upgrades":{"description":"Skips workflow step upgrades, when the parameters for an existing workflow step change","type":"boolean"},"id":{"description":"Unique identifier for the workflow","type":"string"}},"required":["id"]},
    method: "get",
    pathTemplate: "/v2/workflows/{id}",
    executionParameters: [{"name":"skip_step_upgrades","in":"query"},{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Workflows V2"],
    deprecated: false
  }],
  ["Workflows_V2_UpdateWorkflow", {
    name: "Workflows_V2_UpdateWorkflow",
    description: `Updates a workflow
(Tags: Workflows V2)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"ID of the workflow to update","type":"string"},"requestBody":{"properties":{"annotations":{"additionalProperties":{"example":"abc123","type":"string"},"description":"Annotations that track metadata about this resource","type":"object"},"condition_groups":{"description":"Conditions that apply to the workflow trigger","items":{"properties":{"conditions":{"description":"All conditions in this list must be satisfied for the group to be satisfied","items":{"properties":{"operation":{"description":"The name of the operation on the subject","type":"string"},"param_bindings":{"description":"List of parameter bindings","items":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"},"type":"array"},"subject":{"description":"The reference of the subject in the trigger scope","type":"string"}},"required":["subject","operation","param_bindings"],"type":"object"},"type":"array"}},"required":["conditions"],"type":"object"},"type":"array"},"continue_on_step_error":{"description":"Whether to continue executing the workflow if a step fails","type":"boolean"},"delay":{"properties":{"conditions_apply_over_delay":{"description":"If this workflow is delayed, whether the conditions should be rechecked between trigger firing and execution","type":"boolean"},"for_seconds":{"description":"Delay in seconds between trigger firing and running the workflow","format":"int64","type":"number"}},"required":["for_seconds","conditions_apply_over_delay"],"type":"object"},"expressions":{"description":"The expressions to use in the workflow","items":{"properties":{"else_branch":{"properties":{"result":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"}},"required":["result"],"type":"object"},"label":{"description":"The human readable label of the expression","type":"string"},"operations":{"items":{"properties":{"branches":{"properties":{"branches":{"description":"The branches to apply for this operation","items":{"properties":{"condition_groups":{"description":"When one of these condition groups are satisfied, this branch will be evaluated","items":{"properties":{"conditions":{"description":"All conditions in this list must be satisfied for the group to be satisfied","items":{"properties":{"operation":{"description":"The name of the operation on the subject","type":"string"},"param_bindings":{"description":"List of parameter bindings","items":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"},"type":"array"},"subject":{"description":"The reference of the subject in the trigger scope","type":"string"}},"required":["subject","operation","param_bindings"],"type":"object"},"type":"array"}},"required":["conditions"],"type":"object"},"type":"array"},"result":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"}},"required":["condition_groups","result"],"type":"object"},"type":"array"},"returns":{"properties":{"array":{"description":"Whether the return value should be single or multi-value","type":"boolean"},"type":{"description":"Expected return type of this expression (what to try casting the result to)","type":"string"}},"required":["type","array"],"type":"object"}},"required":["branches","returns"],"type":"object"},"concatenate":{"properties":{"reference":{"description":"The reference that you want to concatenate with","type":"string"}},"required":["reference"],"type":"object"},"filter":{"properties":{"condition_groups":{"description":"The condition groups to apply in this filter. Only one group needs to be satisfied for the filter to pass.","items":{"properties":{"conditions":{"description":"All conditions in this list must be satisfied for the group to be satisfied","items":{"properties":{"operation":{"description":"The name of the operation on the subject","type":"string"},"param_bindings":{"description":"List of parameter bindings","items":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"},"type":"array"},"subject":{"description":"The reference of the subject in the trigger scope","type":"string"}},"required":["subject","operation","param_bindings"],"type":"object"},"type":"array"}},"required":["conditions"],"type":"object"},"type":"array"}},"required":["condition_groups"],"type":"object"},"navigate":{"properties":{"reference":{"description":"The reference that you want to navigate to","type":"string"}},"required":["reference"],"type":"object"},"operation_type":{"description":"The type of the operation","enum":["navigate","filter","concatenate","count","min","max","sum","random","first","parse","branches"],"type":"string"},"parse":{"properties":{"returns":{"properties":{"array":{"description":"Whether the return value should be single or multi-value","type":"boolean"},"type":{"description":"Expected return type of this expression (what to try casting the result to)","type":"string"}},"required":["type","array"],"type":"object"},"source":{"description":"Source expression that is evaluated to a result","type":"string"}},"required":["source","returns"],"type":"object"}},"required":["operation_type"],"type":"object"},"type":"array"},"reference":{"description":"A short ID that can be used to reference the expression","type":"string"},"root_reference":{"description":"The root reference for this expression (i.e. where the expression starts)","type":"string"}},"required":["label","reference","root_reference","operations"],"type":"object"},"type":"array"},"folder":{"description":"Folder to display the workflow in","type":"string"},"include_private_escalations":{"description":"Whether to include private escalations","type":"boolean"},"include_private_incidents":{"description":"Whether to include private incidents","type":"boolean"},"name":{"description":"Name provided by the user when creating the workflow","type":"string"},"once_for":{"description":"This workflow will run 'once for' a list of references","items":{"type":"string"},"type":"array"},"runs_on_incident_modes":{"description":"Which incident modes should this workflow run on? By default, workflows only run on standard incidents, but can also be configured to run on test and retrospective incidents.","items":{"enum":["standard","test","retrospective"],"type":"string"},"type":"array"},"runs_on_incidents":{"description":"Which incidents should the workflow be applied to?","enum":["newly_created","newly_created_and_active"],"type":"string"},"shortform":{"description":"The shortform used to trigger this workflow (only applicable for manual triggers)","type":"string"},"skip_step_upgrades":{"description":"Skips workflow step upgrades, when the parameters for an existing workflow step change","type":"boolean"},"state":{"description":"What state this workflow is in","enum":["active","disabled","draft","error"],"type":"string"},"steps":{"description":"Steps that are executed as part of the workflow","items":{"properties":{"for_each":{"description":"Reference to an expression that returns resources to run this step over","type":"string"},"id":{"description":"Unique ID of this step in a workflow","type":"string"},"name":{"description":"Unique name of the step in the engine","type":"string"},"param_bindings":{"description":"List of parameter bindings","items":{"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","items":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"},"type":"array"},"value":{"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","type":"string"},"reference":{"description":"If set, this is the reference into the trigger scope that is the value of this parameter","type":"string"}},"type":"object"}},"type":"object"},"type":"array"}},"required":["id","name","param_bindings"],"type":"object"},"type":"array"}},"required":["name","once_for","condition_groups","steps","expressions","include_private_incidents","runs_on_incident_modes","continue_on_step_error","runs_on_incidents"],"type":"object","description":"The JSON request body."}},"required":["id","requestBody"]},
    method: "put",
    pathTemplate: "/v2/workflows/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Workflows V2"],
    deprecated: false
  }],
  ["Workflows_V2_DestroyWorkflow", {
    name: "Workflows_V2_DestroyWorkflow",
    description: `Archives a workflow
(Tags: Workflows V2)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"Unique identifier for the workflow","type":"string"}},"required":["id"]},
    method: "delete",
    pathTemplate: "/v2/workflows/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Workflows V2"],
    deprecated: false
  }],
  ["Catalog_V3_ListEntries", {
    name: "Catalog_V3_ListEntries",
    description: `List entries for a catalog type.
(Tags: Catalog V3)`,
    inputSchema: {"type":"object","properties":{"catalog_type_id":{"description":"ID of this catalog type","type":"string"},"page_size":{"default":25,"description":"The integer number of records to return","format":"int64","maximum":250,"type":"number"},"after":{"description":"An record's ID. This endpoint will return a list of records after this ID in relation to the API response order.","type":"string"},"identifier":{"description":"If specified, only entries with this identifier will be returned. This will search by ID, external ID, and aliases.\n\nIf 'use name as identifier' is enabled for the catalog type, this will also match on name.","type":"string"}},"required":["catalog_type_id","page_size"]},
    method: "get",
    pathTemplate: "/v3/catalog_entries",
    executionParameters: [{"name":"catalog_type_id","in":"query"},{"name":"page_size","in":"query"},{"name":"after","in":"query"},{"name":"identifier","in":"query"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Catalog V3"],
    deprecated: false
  }],
  ["Catalog_V3_CreateEntry", {
    name: "Catalog_V3_CreateEntry",
    description: `Create an entry within the catalog. We support a maximum of 50,000 entries per type.

If you call this API with a payload where the external_id and catalog_type_id match an existing entry, the existing entry will be updated.
(Tags: Catalog V3)`,
    inputSchema: {"type":"object","properties":{"requestBody":{"properties":{"aliases":{"description":"Optional aliases that can be used to reference this entry","items":{"type":"string"},"type":"array"},"attribute_values":{"additionalProperties":{"example":{"array_value":[{"literal":"SEV123"}],"value":{"literal":"SEV123"}},"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","example":[{"literal":"SEV123"}],"items":{"example":{"literal":"SEV123"},"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","example":"SEV123","type":"string"}},"type":"object"},"type":"array"},"value":{"example":{"literal":"SEV123"},"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","example":"SEV123","type":"string"}},"type":"object"}},"type":"object"},"description":"Values of this entry","type":"object"},"catalog_type_id":{"description":"ID of this catalog type","type":"string"},"external_id":{"description":"An optional alternative ID for this entry, which is ensured to be unique for the type","type":"string"},"name":{"description":"Name is the human readable name of this entry","type":"string"},"rank":{"description":"When catalog type is ranked, this is used to help order things","format":"int32","type":"number"}},"required":["catalog_type_id","name","attribute_values"],"type":"object","description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/v3/catalog_entries",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Catalog V3"],
    deprecated: false
  }],
  ["Catalog_V3_BulkUpdateEntries", {
    name: "Catalog_V3_BulkUpdateEntries",
    description: `Update multiple catalog entries in a single operation. You can update up to 250 entries at once. This operation is atomic - either all entries are updated successfully, or none are updated.
(Tags: Catalog V3)`,
    inputSchema: {"type":"object","properties":{"requestBody":{"properties":{"catalog_type_id":{"description":"The unique identifier of the catalog type containing the entries","type":"string"},"entries":{"description":"A list of entries to update with their new values. Maximum 250 entries per request.","items":{"description":"Represents a partial entry update, allowing selective field updates","properties":{"aliases":{"description":"If specified, will update the aliases of the entry. When omitted, preserves the existing aliases.","items":{"type":"string"},"type":"array"},"attribute_values":{"additionalProperties":{"example":{"array_value":[{"literal":"SEV123"}],"value":{"literal":"SEV123"}},"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","example":[{"literal":"SEV123"}],"items":{"example":{"literal":"SEV123"},"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","example":"SEV123","type":"string"}},"type":"object"},"type":"array"},"value":{"example":{"literal":"SEV123"},"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","example":"SEV123","type":"string"}},"type":"object"}},"type":"object"},"description":"The attribute values to apply to this entry","type":"object"},"entry_id":{"description":"ID of the relevant catalog entry","type":"string"},"external_id":{"description":"If specified, will update the external ID of the entry. When omitted, preserves the existing external ID.","type":"string"},"name":{"description":"If specified, will update the name of the entry. When omitted, preserves the existing name.","type":"string"},"rank":{"description":"If specified, will update the rank of the entry. When omitted, rank will be set to null (allowing rank removal).","format":"int32","type":"number"}},"required":["entry_id","attribute_values"],"type":"object"},"maxItems":250,"minItems":1,"type":"array"},"update_attributes":{"description":"Optional list of specific attribute IDs to update across all entries. When provided, only these attributes in attribute_values will be updated and all other attributes will be preserved. This parameter only affects attribute_values - it does not affect core entry fields like name, rank, aliases, or external_id, which follow their individual omission rules.","items":{"type":"string"},"type":"array"}},"required":["catalog_type_id","entries"],"type":"object","description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/v3/catalog_entries/actions/bulk_update",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Catalog V3"],
    deprecated: false
  }],
  ["Catalog_V3_ShowEntry", {
    name: "Catalog_V3_ShowEntry",
    description: `Show a single catalog entry.
(Tags: Catalog V3)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"ID of this catalog entry","type":"string"}},"required":["id"]},
    method: "get",
    pathTemplate: "/v3/catalog_entries/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Catalog V3"],
    deprecated: false
  }],
  ["Catalog_V3_UpdateEntry", {
    name: "Catalog_V3_UpdateEntry",
    description: `Updates an existing catalog entry.
(Tags: Catalog V3)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"ID of this catalog entry","type":"string"},"requestBody":{"properties":{"aliases":{"description":"Optional aliases that can be used to reference this entry","items":{"type":"string"},"type":"array"},"attribute_values":{"additionalProperties":{"example":{"array_value":[{"literal":"SEV123"}],"value":{"literal":"SEV123"}},"properties":{"array_value":{"description":"If set, this is the array value of the step parameter","example":[{"literal":"SEV123"}],"items":{"example":{"literal":"SEV123"},"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","example":"SEV123","type":"string"}},"type":"object"},"type":"array"},"value":{"example":{"literal":"SEV123"},"properties":{"literal":{"description":"If set, this is the literal value of the step parameter","example":"SEV123","type":"string"}},"type":"object"}},"type":"object"},"description":"Values of this entry","type":"object"},"external_id":{"description":"An optional alternative ID for this entry, which is ensured to be unique for the type","type":"string"},"name":{"description":"Name is the human readable name of this entry","type":"string"},"rank":{"description":"When catalog type is ranked, this is used to help order things","format":"int32","type":"number"},"update_attributes":{"description":"If provided, only update these attribute_values keys. If not provided, update all attribute values.\nIf you specify an attribute key that's not in your payload, the associated attribute value will be cleared.","items":{"type":"string"},"type":"array"}},"required":["name","attribute_values"],"type":"object","description":"The JSON request body."}},"required":["id","requestBody"]},
    method: "put",
    pathTemplate: "/v3/catalog_entries/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Catalog V3"],
    deprecated: false
  }],
  ["Catalog_V3_DestroyEntry", {
    name: "Catalog_V3_DestroyEntry",
    description: `Archives a catalog entry.
(Tags: Catalog V3)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"ID of this catalog entry","type":"string"}},"required":["id"]},
    method: "delete",
    pathTemplate: "/v3/catalog_entries/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Catalog V3"],
    deprecated: false
  }],
  ["Catalog_V3_ListResources", {
    name: "Catalog_V3_ListResources",
    description: `List available engine resources for the catalog.

A resource represents a type of data that can be held within the catalog, so this
endpoint can be used to see what attribute types can be used when updating the
schema of a catalog type.

(Tags: Catalog V3)`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/v3/catalog_resources",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Catalog V3"],
    deprecated: false
  }],
  ["Catalog_V3_ListTypes", {
    name: "Catalog_V3_ListTypes",
    description: `List all catalog types for an organisation, including those synced from external resources.
(Tags: Catalog V3)`,
    inputSchema: {"type":"object","properties":{}},
    method: "get",
    pathTemplate: "/v3/catalog_types",
    executionParameters: [],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Catalog V3"],
    deprecated: false
  }],
  ["Catalog_V3_CreateType", {
    name: "Catalog_V3_CreateType",
    description: `Create a catalog type. The schema must be updated using the UpdateTypeSchema endpoint.
(Tags: Catalog V3)`,
    inputSchema: {"type":"object","properties":{"requestBody":{"properties":{"annotations":{"additionalProperties":{"example":"abc123","type":"string"},"description":"Annotations that can track metadata about this type","type":"object"},"categories":{"description":"What categories is this type considered part of","items":{"enum":["customer","issue-tracker","product-feature","service","on-call","team","user"],"type":"string"},"type":"array"},"color":{"description":"Sets the display color of this type in the dashboard","enum":["yellow","green","blue","violet","pink","cyan","orange"],"type":"string"},"description":{"description":"Human readble description of this type","type":"string"},"icon":{"description":"Sets the display icon of this type in the dashboard","enum":["alert","bolt","box","briefcase","browser","bulb","calendar","clock","cog","components","database","doc","email","escalation-path","files","flag","folder","globe","money","server","severity","status-page","store","star","tag","user","users"],"type":"string"},"name":{"description":"Name is the human readable name of this type","type":"string"},"ranked":{"description":"If this type should be ranked","type":"boolean"},"source_repo_url":{"description":"The url of the external repository where this type is managed","type":"string"},"type_name":{"description":"The type name of this catalog type, to be used when defining attributes. This is immutable once a CatalogType has been created. For non-externally sync types, it must follow the pattern Custom[\"SomeName\"]","type":"string"},"use_name_as_identifier":{"description":"If enabled, you can refer to entries of this type by their name, as well as their external ID and any aliases.","type":"boolean"}},"required":["name","description"],"type":"object","description":"The JSON request body."}},"required":["requestBody"]},
    method: "post",
    pathTemplate: "/v3/catalog_types",
    executionParameters: [],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Catalog V3"],
    deprecated: false
  }],
  ["Catalog_V3_ShowType", {
    name: "Catalog_V3_ShowType",
    description: `Show a single catalog type.
(Tags: Catalog V3)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"ID of this catalog type","type":"string"}},"required":["id"]},
    method: "get",
    pathTemplate: "/v3/catalog_types/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Catalog V3"],
    deprecated: false
  }],
  ["Catalog_V3_UpdateType", {
    name: "Catalog_V3_UpdateType",
    description: `Updates an existing catalog type. The schema must be updated using the UpdateTypeSchema endpoint.
(Tags: Catalog V3)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"ID of this catalog type","type":"string"},"requestBody":{"properties":{"annotations":{"additionalProperties":{"example":"abc123","type":"string"},"description":"Annotations that can track metadata about this type","type":"object"},"categories":{"description":"What categories is this type considered part of","items":{"enum":["customer","issue-tracker","product-feature","service","on-call","team","user"],"type":"string"},"type":"array"},"color":{"description":"Sets the display color of this type in the dashboard","enum":["yellow","green","blue","violet","pink","cyan","orange"],"type":"string"},"description":{"description":"Human readble description of this type","type":"string"},"icon":{"description":"Sets the display icon of this type in the dashboard","enum":["alert","bolt","box","briefcase","browser","bulb","calendar","clock","cog","components","database","doc","email","escalation-path","files","flag","folder","globe","money","server","severity","status-page","store","star","tag","user","users"],"type":"string"},"name":{"description":"Name is the human readable name of this type","type":"string"},"ranked":{"description":"If this type should be ranked","type":"boolean"},"source_repo_url":{"description":"The url of the external repository where this type is managed","type":"string"},"use_name_as_identifier":{"description":"If enabled, you can refer to entries of this type by their name, as well as their external ID and any aliases.","type":"boolean"}},"required":["name","description"],"type":"object","description":"The JSON request body."}},"required":["id","requestBody"]},
    method: "put",
    pathTemplate: "/v3/catalog_types/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Catalog V3"],
    deprecated: false
  }],
  ["Catalog_V3_DestroyType", {
    name: "Catalog_V3_DestroyType",
    description: `Archives a catalog type and associated entries.
(Tags: Catalog V3)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"ID of this catalog type","type":"string"}},"required":["id"]},
    method: "delete",
    pathTemplate: "/v3/catalog_types/{id}",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: undefined,
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Catalog V3"],
    deprecated: false
  }],
  ["Catalog_V3_UpdateTypeSchema", {
    name: "Catalog_V3_UpdateTypeSchema",
    description: `Update an existing catalog types schema, adding or removing attributes.

Updating the schema is handled separately from creating and updating types, so that you don't
have to worry about dependencies between types. For example, if type A has an attribute that
relies on type B, you would have to create type B first.

By allowing the creation of types without a schema, they can be created in any order, but it
means that you need to make a separate call to this endpoint to update the schema.
(Tags: Catalog V3)`,
    inputSchema: {"type":"object","properties":{"id":{"description":"ID of this catalog type","type":"string"},"requestBody":{"properties":{"attributes":{"items":{"properties":{"array":{"description":"Whether this attribute is an array","type":"boolean"},"backlink_attribute":{"description":"The attribute to use (if this is a backlink)","type":"string"},"id":{"description":"The ID of this attribute","type":"string"},"mode":{"description":"Controls how this attribute is modified","enum":["","api","dashboard","external","internal","dynamic","backlink","path"],"type":"string","x-public-api-version":"v3"},"name":{"description":"Unique name of this attribute","type":"string"},"path":{"description":"The path to use (if this is an path)","items":{"properties":{"attribute_id":{"description":"the ID of the attribute to use","type":"string"}},"required":["attribute_id"],"type":"object"},"type":"array"},"type":{"description":"Catalog type name for this attribute","type":"string"}},"required":["name","type","array"],"type":"object"},"type":"array"},"version":{"format":"int64","type":"number"}},"required":["attributes","version"],"type":"object","description":"The JSON request body."}},"required":["id","requestBody"]},
    method: "post",
    pathTemplate: "/v3/catalog_types/{id}/actions/update_schema",
    executionParameters: [{"name":"id","in":"path"}],
    requestBodyContentType: "application/json",
    securityRequirements: [{"bearerAuth":[]}],
    tags: ["Catalog V3"],
    deprecated: false
  }],
]);

/**
 * Security schemes from the OpenAPI spec
 */
const securitySchemes =   {
    "bearerAuth": {
      "type": "http",
      "scheme": "bearer",
      "description": "incident.io API key passed as a bearer token."
    }
  };


server.setRequestHandler(ListToolsRequestSchema, async () => {
  const toolsForClient: Tool[] = Array.from(toolDefinitionMap.values()).map(def => ({
    name: def.name,
    description: def.description,
    inputSchema: def.inputSchema
  }));
  return { tools: toolsForClient };
});


server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest): Promise<CallToolResult> => {
  const { name: toolName, arguments: toolArgs } = request.params;
  const toolDefinition = toolDefinitionMap.get(toolName);
  if (!toolDefinition) {
    console.error(`Error: Unknown tool requested: ${toolName}`);
    return { content: [{ type: "text", text: `Error: Unknown tool requested: ${toolName}` }] };
  }
  return await executeApiTool(toolName, toolDefinition, toolArgs ?? {}, securitySchemes);
});



/**
 * Type definition for cached OAuth tokens
 */
interface TokenCacheEntry {
    token: string;
    expiresAt: number;
}

/**
 * Declare global __oauthTokenCache property for TypeScript
 */
declare global {
    var __oauthTokenCache: Record<string, TokenCacheEntry> | undefined;
}

/**
 * Acquires an OAuth2 token using client credentials flow
 * 
 * @param schemeName Name of the security scheme
 * @param scheme OAuth2 security scheme
 * @returns Acquired token or null if unable to acquire
 */
async function acquireOAuth2Token(schemeName: string, scheme: any): Promise<string | null | undefined> {
    try {
        // Check if we have the necessary credentials (resolved per-scheme at runtime)
        const clientId = process.env[`OAUTH_CLIENT_ID_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
        const clientSecret = process.env[`OAUTH_CLIENT_SECRET_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
        const scopes = process.env[`OAUTH_SCOPES_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];

        if (!clientId || !clientSecret) {
            console.error(`Missing client credentials for OAuth2 scheme '${schemeName}'`);
            return null;
        }
        
        // Initialize token cache if needed
        if (typeof global.__oauthTokenCache === 'undefined') {
            global.__oauthTokenCache = {};
        }
        
        // Check if we have a cached token
        const cacheKey = `${schemeName}_${clientId}`;
        const cachedToken = global.__oauthTokenCache[cacheKey];
        const now = Date.now();
        
        if (cachedToken && cachedToken.expiresAt > now) {
            console.error(`Using cached OAuth2 token for '${schemeName}' (expires in ${Math.floor((cachedToken.expiresAt - now) / 1000)} seconds)`);
            return cachedToken.token;
        }
        
        // Determine token URL based on flow type
        let tokenUrl = '';
        if (scheme.flows?.clientCredentials?.tokenUrl) {
            tokenUrl = scheme.flows.clientCredentials.tokenUrl;
            console.error(`Using client credentials flow for '${schemeName}'`);
        } else if (scheme.flows?.password?.tokenUrl) {
            tokenUrl = scheme.flows.password.tokenUrl;
            console.error(`Using password flow for '${schemeName}'`);
        } else {
            console.error(`No supported OAuth2 flow found for '${schemeName}'`);
            return null;
        }
        
        // Prepare the token request
        let formData = new URLSearchParams();
        formData.append('grant_type', 'client_credentials');
        
        // Add scopes if specified
        if (scopes) {
            formData.append('scope', scopes);
        }

        console.error(`Requesting OAuth2 token from ${tokenUrl}`);

        // Make the token request
        const response = await axios({
            method: 'POST',
            url: tokenUrl,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
            },
            data: formData.toString()
        });
        
        // Process the response
        if (response.data?.access_token) {
            const token = response.data.access_token;
            const expiresIn = response.data.expires_in || 3600; // Default to 1 hour
            
            // Cache the token
            global.__oauthTokenCache[cacheKey] = {
                token,
                expiresAt: now + (expiresIn * 1000) - 60000 // Expire 1 minute early
            };
            
            console.error(`Successfully acquired OAuth2 token for '${schemeName}' (expires in ${expiresIn} seconds)`);
            return token;
        } else {
            console.error(`Failed to acquire OAuth2 token for '${schemeName}': No access_token in response`);
            return null;
        }
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`Error acquiring OAuth2 token for '${schemeName}':`, errorMessage);
        return null;
    }
}


/**
 * Executes an API tool with the provided arguments
 * 
 * @param toolName Name of the tool to execute
 * @param definition Tool definition
 * @param toolArgs Arguments provided by the user
 * @param allSecuritySchemes Security schemes from the OpenAPI spec
 * @returns Call tool result
 */
async function executeApiTool(
    toolName: string,
    definition: McpToolDefinition,
    toolArgs: JsonObject,
    allSecuritySchemes: Record<string, any>
): Promise<CallToolResult> {
  try {
    // Validate arguments against the input schema
    let validatedArgs: JsonObject;
    try {
        const zodSchema = getZodSchemaFromJsonSchema(definition.inputSchema, toolName);
        const argsToParse = (typeof toolArgs === 'object' && toolArgs !== null) ? toolArgs : {};
        validatedArgs = zodSchema.parse(argsToParse);
    } catch (error: unknown) {
        if (error instanceof ZodError) {
            const validationErrorMessage = `Invalid arguments for tool '${toolName}': ${error.errors.map(e => `${e.path.join('.')} (${e.code}): ${e.message}`).join(', ')}`;
            return { content: [{ type: 'text', text: validationErrorMessage }] };
        } else {
             const errorMessage = error instanceof Error ? error.message : String(error);
             return { content: [{ type: 'text', text: `Internal error during validation setup: ${errorMessage}` }] };
        }
    }

    // Prepare URL, query parameters, headers, and request body
    let urlPath = definition.pathTemplate;
    const queryParams: Record<string, any> = {};
    const headers: Record<string, string> = { 'Accept': 'application/json' };
    let requestBodyData: any = undefined;

    // Apply parameters to the URL path, query, or headers
    definition.executionParameters.forEach((param) => {
        const value = validatedArgs[param.name];
        if (typeof value !== 'undefined' && value !== null) {
            if (param.in === 'path') {
                urlPath = urlPath.replace(`{${param.name}}`, encodeURIComponent(String(value)));
            }
            else if (param.in === 'query') {
                queryParams[param.name] = value;
            }
            else if (param.in === 'header') {
                headers[param.name.toLowerCase()] = String(value);
            }
        }
    });

    // Ensure all path parameters are resolved
    if (urlPath.includes('{')) {
        throw new Error(`Failed to resolve path parameters: ${urlPath}`);
    }
    
    // Construct the full URL
    const requestUrl = API_BASE_URL ? `${API_BASE_URL}${urlPath}` : urlPath;

    // Handle request body if needed
    if (definition.requestBodyContentType && typeof validatedArgs['requestBody'] !== 'undefined') {
        requestBodyData = validatedArgs['requestBody'];
        headers['content-type'] = definition.requestBodyContentType;
    }

    // Custom auth hook (see src/auth.ts). Returning true short-circuits built-in auth.
    const customAuthHandled = await applyCustomAuth({ headers, queryParams, toolName, definition });
    if (customAuthHandled) {
        console.error(`Custom auth applied for tool '${toolName}', skipping built-in auth.`);
    }
    if (!customAuthHandled) {

    // Apply security requirements if available
    // Security requirements use OR between array items and AND within each object
    const appliedSecurity = definition.securityRequirements?.find(req => {
        // Try each security requirement (combined with OR)
        return Object.entries(req).every(([schemeName, scopesArray]) => {
            const scheme = allSecuritySchemes[schemeName];
            if (!scheme) return false;
            
            // API Key security (header, query, cookie)
            if (scheme.type === 'apiKey') {
                return !!process.env[`API_KEY_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
            }
            
            // HTTP security (basic, bearer)
            if (scheme.type === 'http') {
                if (scheme.scheme?.toLowerCase() === 'bearer') {
                    return !!process.env[`BEARER_TOKEN_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
                }
                else if (scheme.scheme?.toLowerCase() === 'basic') {
                    // Username is sufficient; an empty password is valid per RFC 7617 (issue #66)
                    return process.env[`BASIC_USERNAME_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`] != null;
                }
            }
            
            // OAuth2 security
            if (scheme.type === 'oauth2') {
                // Check for pre-existing token
                if (process.env[`OAUTH_TOKEN_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`]) {
                    return true;
                }
                
                // Check for client credentials for auto-acquisition
                if (process.env[`OAUTH_CLIENT_ID_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`] &&
                    process.env[`OAUTH_CLIENT_SECRET_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`]) {
                    // Verify we have a supported flow
                    if (scheme.flows?.clientCredentials || scheme.flows?.password) {
                        return true;
                    }
                }
                
                return false;
            }
            
            // OpenID Connect
            if (scheme.type === 'openIdConnect') {
                return !!process.env[`OPENID_TOKEN_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
            }
            
            return false;
        });
    });

    // If we found matching security scheme(s), apply them
    if (appliedSecurity) {
        // Apply each security scheme from this requirement (combined with AND)
        for (const [schemeName, scopesArray] of Object.entries(appliedSecurity)) {
            const scheme = allSecuritySchemes[schemeName];
            
            // API Key security
            if (scheme?.type === 'apiKey') {
                const apiKey = process.env[`API_KEY_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
                if (apiKey) {
                    if (scheme.in === 'header') {
                        headers[scheme.name.toLowerCase()] = apiKey;
                        console.error(`Applied API key '${schemeName}' in header '${scheme.name}'`);
                    }
                    else if (scheme.in === 'query') {
                        queryParams[scheme.name] = apiKey;
                        console.error(`Applied API key '${schemeName}' in query parameter '${scheme.name}'`);
                    }
                    else if (scheme.in === 'cookie') {
                        // Add the cookie, preserving other cookies if they exist
                        headers['cookie'] = `${scheme.name}=${apiKey}${headers['cookie'] ? `; ${headers['cookie']}` : ''}`;
                        console.error(`Applied API key '${schemeName}' in cookie '${scheme.name}'`);
                    }
                }
            } 
            // HTTP security (Bearer or Basic)
            else if (scheme?.type === 'http') {
                if (scheme.scheme?.toLowerCase() === 'bearer') {
                    const token = process.env[`BEARER_TOKEN_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
                    if (token) {
                        headers['authorization'] = `Bearer ${token}`;
                        console.error(`Applied Bearer token for '${schemeName}'`);
                    }
                } 
                else if (scheme.scheme?.toLowerCase() === 'basic') {
                    const username = process.env[`BASIC_USERNAME_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
                    const password = process.env[`BASIC_PASSWORD_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
                    // Empty password is valid per RFC 7617 (issue #66); only username is required.
                    if (username != null) {
                        headers['authorization'] = `Basic ${Buffer.from(`${username}:${password ?? ''}`).toString('base64')}`;
                        console.error(`Applied Basic authentication for '${schemeName}'`);
                    }
                }
            }
            // OAuth2 security
            else if (scheme?.type === 'oauth2') {
                // First try to use a pre-provided token
                let token = process.env[`OAUTH_TOKEN_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
                
                // If no token but we have client credentials, try to acquire a token
                if (!token && (scheme.flows?.clientCredentials || scheme.flows?.password)) {
                    console.error(`Attempting to acquire OAuth token for '${schemeName}'`);
                    token = (await acquireOAuth2Token(schemeName, scheme)) ?? '';
                }
                
                // Apply token if available
                if (token) {
                    headers['authorization'] = `Bearer ${token}`;
                    console.error(`Applied OAuth2 token for '${schemeName}'`);
                    
                    // List the scopes that were requested, if any
                    const scopes = scopesArray as string[];
                    if (scopes && scopes.length > 0) {
                        console.error(`Requested scopes: ${scopes.join(', ')}`);
                    }
                }
            }
            // OpenID Connect
            else if (scheme?.type === 'openIdConnect') {
                const token = process.env[`OPENID_TOKEN_${schemeName.replace(/[^a-zA-Z0-9]/g, '_').toUpperCase()}`];
                if (token) {
                    headers['authorization'] = `Bearer ${token}`;
                    console.error(`Applied OpenID Connect token for '${schemeName}'`);
                    
                    // List the scopes that were requested, if any
                    const scopes = scopesArray as string[];
                    if (scopes && scopes.length > 0) {
                        console.error(`Requested scopes: ${scopes.join(', ')}`);
                    }
                }
            }
        }
    } 
    // Log warning if security is required but not available
    else if (definition.securityRequirements?.length > 0) {
        // First generate a more readable representation of the security requirements
        const securityRequirementsString = definition.securityRequirements
            .map(req => {
                const parts = Object.entries(req)
                    .map(([name, scopesArray]) => {
                        const scopes = scopesArray as string[];
                        if (scopes.length === 0) return name;
                        return `${name} (scopes: ${scopes.join(', ')})`;
                    })
                    .join(' AND ');
                return `[${parts}]`;
            })
            .join(' OR ');
            
        console.warn(`Tool '${toolName}' requires security: ${securityRequirementsString}, but no suitable credentials found.`);
    }
    
    }

    // Prepare the axios request configuration
    const config: AxiosRequestConfig = {
      method: definition.method.toUpperCase(),
      url: requestUrl,
      params: queryParams,
      headers: headers,
      // Serialize array query params as comma-separated values (issue #41)
      paramsSerializer: (params: Record<string, any>) => {
        const search = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
          if (value === undefined || value === null) continue;
          search.append(key, Array.isArray(value) ? value.join(',') : String(value));
        }
        return search.toString();
      },
      ...(requestBodyData !== undefined && { data: requestBodyData }),
    };

    // Log request info to stderr (doesn't affect MCP output)
    console.error(`Executing tool "${toolName}": ${config.method} ${config.url}`);

    // Execute the request
    const response = await axios(config);

    // Process and format the response
    let responseText = '';
    // Coerce header value to string before lowercasing (issue #65)
    const contentType = String(response.headers['content-type'] ?? '').toLowerCase();
    
    // Handle JSON responses
    if (contentType.includes('application/json') && typeof response.data === 'object' && response.data !== null) {
         try { 
             responseText = JSON.stringify(response.data, null, 2); 
         } catch (e) { 
             responseText = "[Stringify Error]"; 
         }
    } 
    // Handle string responses
    else if (typeof response.data === 'string') { 
         responseText = response.data; 
    }
    // Handle other response types
    else if (response.data !== undefined && response.data !== null) { 
         responseText = String(response.data); 
    }
    // Handle empty responses
    else { 
         responseText = `(Status: ${response.status} - No body content)`; 
    }
    
    // Return formatted response
    return { 
        content: [ 
            { 
                type: "text", 
                text: `API Response (Status: ${response.status}):\n${responseText}` 
            } 
        ], 
    };

  } catch (error: unknown) {
    // Handle errors during execution
    let errorMessage: string;
    
    // Format Axios errors specially
    if (axios.isAxiosError(error)) { 
        errorMessage = formatApiError(error); 
    }
    // Handle standard errors
    else if (error instanceof Error) { 
        errorMessage = error.message; 
    }
    // Handle unexpected error types
    else { 
        errorMessage = 'Unexpected error: ' + String(error); 
    }
    
    // Log error to stderr
    console.error(`Error during execution of tool '${toolName}':`, errorMessage);
    
    // Return error message to client
    return { content: [{ type: "text", text: errorMessage }] };
  }
}


/**
 * Main function to start the server
 */
async function main() {
// Set up stdio transport
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error(`${SERVER_NAME} MCP Server (v${SERVER_VERSION}) running on stdio${API_BASE_URL ? `, proxying API at ${API_BASE_URL}` : ''}`);
  } catch (error) {
    console.error("Error during server startup:", error);
    process.exit(1);
  }
}

/**
 * Cleanup function for graceful shutdown
 */
async function cleanup() {
    console.error("Shutting down MCP server...");
    process.exit(0);
}

// Register signal handlers
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

// Start the server
main().catch((error) => {
  console.error("Fatal error in main execution:", error);
  process.exit(1);
});

/**
 * Formats API errors for better readability
 * 
 * @param error Axios error
 * @returns Formatted error message
 */
function formatApiError(error: AxiosError): string {
    let message = 'API request failed.';
    if (error.response) {
        message = `API Error: Status ${error.response.status} (${error.response.statusText || 'Status text not available'}). `;
        const responseData = error.response.data;
        const MAX_LEN = 200;
        if (typeof responseData === 'string') { 
            message += `Response: ${responseData.substring(0, MAX_LEN)}${responseData.length > MAX_LEN ? '...' : ''}`; 
        }
        else if (responseData) { 
            try { 
                const jsonString = JSON.stringify(responseData); 
                message += `Response: ${jsonString.substring(0, MAX_LEN)}${jsonString.length > MAX_LEN ? '...' : ''}`; 
            } catch { 
                message += 'Response: [Could not serialize data]'; 
            } 
        }
        else { 
            message += 'No response body received.'; 
        }
    } else if (error.request) {
        message = 'API Network Error: No response received from server.';
        if (error.code) message += ` (Code: ${error.code})`;
    } else { 
        message += `API Request Setup Error: ${error.message}`; 
    }
    return message;
}

/**
 * Converts a JSON Schema to a Zod schema for runtime validation
 * 
 * @param jsonSchema JSON Schema
 * @param toolName Tool name for error reporting
 * @returns Zod schema
 */
function getZodSchemaFromJsonSchema(jsonSchema: any, toolName: string): z.ZodTypeAny {
    if (typeof jsonSchema !== 'object' || jsonSchema === null) { 
        return z.object({}).passthrough(); 
    }
    try {
        const zodSchemaString = jsonSchemaToZod(jsonSchema);
        const zodSchema = eval(zodSchemaString);
        if (typeof zodSchema?.parse !== 'function') { 
            throw new Error('Eval did not produce a valid Zod schema.'); 
        }
        return zodSchema as z.ZodTypeAny;
    } catch (err: any) {
        console.error(`Failed to generate/evaluate Zod schema for '${toolName}':`, err);
        return z.object({}).passthrough();
    }
}
