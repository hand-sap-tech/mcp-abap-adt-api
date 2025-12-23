DISCLAIMER: This server is still in experimental status! Use it with caution!

# ABAP-ADT-API MCP-Server

[![smithery badge](https://smithery.ai/badge/@mario-andreschak/mcp-abap-abap-adt-api)](https://smithery.ai/server/@mario-andreschak/mcp-abap-abap-adt-api)

## Description

The MCP-Server `mcp-abap-abap-adt-api` is a Model Context Protocol (MCP) server designed to facilitate seamless communication between ABAP systems and MCP clients. It is a wrapper for [abap-adt-api](https://github.com/marcellourbani/abap-adt-api/) and provides a suite of tools and resources for managing ABAP objects, handling transport requests, performing code analysis, and more, enhancing the efficiency and effectiveness of ABAP development workflows.

## Features

- **Authentication**: Securely authenticate with ABAP systems using the `login` tool.
- **Object Management**: Create, read, update, and delete ABAP objects seamlessly.
- **Transport Handling**: Manage transport requests with tools like `createTransport` and `transportInfo`.
- **Code Analysis**: Perform syntax checks and retrieve code completion suggestions.
- **Extensibility**: Easily extend the server with additional tools and resources as needed.
- **Session Management**: Handle session caching and termination using `dropSession` and `logout`.

## Installation

### Installing via Smithery

To install ABAP-ADT-API MCP-Server for Claude Desktop automatically via [Smithery](https://smithery.ai/server/@mario-andreschak/mcp-abap-abap-adt-api):

```bash
npx -y @smithery/cli install @mario-andreschak/mcp-abap-abap-adt-api --client claude
```

### Prerequisites

- **Node.js**: Ensure you have Node.js installed. You can download it from [here](https://nodejs.org/).
- **ABAP System Access**: Credentials and URL to access the ABAP system.

### Steps

1. **Clone the Repository**

   ```cmd
   git clone https://github.com/mario-andreschak/mcp-abap-abap-adt-api.git
   cd mcp-abap-abap-adt-api
   ```

2. **Install Dependencies**

   ```cmd
   npm install
   ```

3. **Configure Environment Variables**

   An `.env.example` file is provided in the root directory as a template for the required environment variables. To set up your environment:

   a. Copy the `.env.example` file and rename it to `.env`:
      ```bash
      cp .env.example .env
      ```

   b. Open the `.env` file and replace the placeholder values with your actual SAP connection details:

      ```env
      SAP_URL=https://your-sap-server.com:44300
      SAP_USER=YOUR_SAP_USERNAME
      SAP_PASSWORD=YOUR_SAP_PASSWORD
      SAP_CLIENT=YOUR_SAP_CLIENT
      SAP_LANGUAGE=YOUR_SAP_LANGUAGE
      ```

   Note: The SAP_CLIENT and SAP_LANGUAGE variables are optional but recommended.

   If you're using self-signed certificates, you can also set:

   ```env
   NODE_TLS_REJECT_UNAUTHORIZED="0"
   ```

   IMPORTANT: Never commit your `.env` file to version control. It's already included in `.gitignore` to prevent accidental commits.

4. **Build the Project**

   ```cmd
   npm run build
   ```

5. **Run the Server**

   ```cmd
   npm run start
   ```

   (or alternatively integrate the MCP Server into VSCode)

## Usage

Once the server is running, you can interact with it using MCP clients or tools that support the Model Context Protocol (e.g. [Cline](https://github.com/cline/cline)). In order to integrate the MCP Server with Cline, use the following MCP Configuration:
```
    "mcp-abap-abap-adt-api": {
      "command": "node",
      "args": [
        "PATH_TO_YOUR/mcp-abap-abap-adt-api/dist/index.js"
      ],
      "disabled": true,
      "autoApprove": [
      ]
    },

```

## Custom Instruction
Use this Custom Instruction to explain the tool to your model:
```
## mcp-abap-abap-adt-api Server

This server provides tools for interacting with an SAP system via ADT (ABAP Development Tools) APIs. It allows you to retrieve information about ABAP objects, modify source code, and manage transports.

**Key Tools and Usage:**

*   **`searchObject`:** Finds ABAP objects based on a query string (e.g., class name).
    *   `query`: (string, required) The search term.
    *   Returns the object's URI.  Example: `/sap/bc/adt/oo/classes/zcl_invoice_xml_gen_model`

*   **`transportInfo`:** Retrieves transport information for a given object.
    *   `objSourceUrl`: (string, required) The object's URI (obtained from `searchObject`).
    *   Returns transport details, including the transport request number (`TRKORR` or `transportInfo.LOCKS.HEADER.TRKORR` in the JSON response).

*   **`lock`:** Locks an ABAP object for editing.
    *   `objectUrl`: (string, required) The object's URI.
    *   Returns a `lockHandle`, which is required for subsequent modifications.

*   **`unLock`:** Unlocks a previously locked ABAP object.
    *   `objectUrl`: (string, required) The object's URI.
    *   `lockHandle`: (string, required) The lock handle obtained from the `lock` operation.

*   **`setObjectSource`:** Modifies the source code of an ABAP object.
    *   `objectSourceUrl`: (string, required) The object's URI *with the suffix `/source/main`*.  Example: `/sap/bc/adt/oo/classes/zcl_invoice_xml_gen_model/source/main`
    *   `lockHandle`: (string, required) The lock handle obtained from the `lock` operation.
    *   `source`: (string, required) The complete, modified ABAP source code.
    *   `transport`: (string, optional) The transport request number.

*   **`syntaxCheckCode`:** Performs a syntax check on a given ABAP source code.
    *   `code`: (string, required) The ABAP source code to check.
    *   `url`: (string, optional) The URL of the object.
    *   `mainUrl`: (string, optional) The main URL.
    *   `mainProgram`: (string, optional) The main program.
    *   `version`: (string, optional) The version.
    *   Returns syntax check results, including any errors.

*   **`activateByName`:** Activates an ABAP object using its name and URL. (See notes below on activation/unlocking.)
    *   `objectName`: (string, required) Name of the object.
    *   `objectUrl`: (string, required) URL of the object.
*   **`activateObjects`:** Activates one or more ABAP objects using object references (e.g., from `inactiveObjects`).
    *   `objects`: (string, required) JSON array of object references to activate.

*   **`getObjectSource`:** Retrieves the source code of an ABAP object.
    *   `objectSourceUrl`: (string, required) The object's URI *with the suffix `/source/main`*.

**All Tools (complete list with descriptions):**

*   **Health:**
    *   `healthcheck`: Check server health and connectivity
*   **Authentication:**
    *   `login`: Authenticate with ABAP system
    *   `logout`: Terminate ABAP session
    *   `dropSession`: Clear local session cache
*   **Transports:**
    *   `transportInfo`: Get transport information for an object source
    *   `createTransport`: Create a new transport request
    *   `hasTransportConfig`: Check if transport configuration exists
    *   `transportConfigurations`: Retrieves transport configurations.
    *   `getTransportConfiguration`: Retrieves a specific transport configuration.
    *   `setTransportsConfig`: Sets transport configurations.
    *   `createTransportsConfig`: Creates transport configurations.
    *   `userTransports`: Retrieves transports for a user.
    *   `transportsByConfig`: Retrieves transports by configuration.
    *   `transportDelete`: Deletes a transport.
    *   `transportRelease`: Releases a transport.
    *   `transportSetOwner`: Sets the owner of a transport.
    *   `transportAddUser`: Adds a user to a transport.
    *   `systemUsers`: Retrieves a list of system users.
    *   `transportReference`: Retrieves a transport reference.
*   **Objects:**
    *   `objectStructure`: Get object structure details
    *   `searchObject`: Search for objects
    *   `findObjectPath`: Find path for an object
    *   `objectTypes`: Retrieves object types.
    *   `reentranceTicket`: Retrieves a reentrance ticket.
*   **Classes:**
    *   `classIncludes`: Get class includes structure
    *   `classComponents`: List class components
*   **Code Analysis:**
    *   `syntaxCheckCode`: Perform ABAP syntax check with source code
    *   `syntaxCheckCdsUrl`: Perform ABAP syntax check with CDS URL
    *   `codeCompletion`: Get code completion suggestions
    *   `findDefinition`: Find symbol definition
    *   `usageReferences`: Find symbol references
    *   `syntaxCheckTypes`: Retrieves syntax check types.
    *   `codeCompletionFull`: Performs full code completion.
    *   `runClass`: Runs a class.
    *   `codeCompletionElement`: Retrieves code completion element information.
    *   `usageReferenceSnippets`: Retrieves usage reference snippets.
    *   `fixProposals`: Retrieves fix proposals.
    *   `fixEdits`: Applies fix edits.
    *   `fragmentMappings`: Retrieves fragment mappings.
    *   `abapDocumentation`: Retrieves ABAP documentation.
*   **Locks:**
    *   `lock`: Lock an object
    *   `unLock`: Unlock an object
*   **Object Source:**
    *   `getObjectSource`: Retrieves source code for ABAP objects
    *   `setObjectSource`: Sets source code for ABAP objects
*   **Object Deletion:**
    *   `deleteObject`: Deletes an ABAP object from the system
*   **Activation & Inactive Objects:**
    *   `activateObjects`: Activate ABAP objects using object references
    *   `activateByName`: Activate an ABAP object using name and URL
    *   `inactiveObjects`: Get list of inactive objects
*   **Object Creation & Registration:**
    *   `objectRegistrationInfo`: Get registration information for an ABAP object
    *   `validateNewObject`: Validate parameters for a new ABAP object
    *   `createObject`: Create a new ABAP object
*   **Node/Hierarchy:**
    *   `nodeContents`: Retrieves the contents of a node in the ABAP repository tree.
    *   `mainPrograms`: Retrieves the main programs for a given include.
*   **ADT Discovery:**
    *   `featureDetails`: Retrieves details for a given feature.
    *   `collectionFeatureDetails`: Retrieves details for a given collection feature.
    *   `findCollectionByUrl`: Finds a collection by its URL.
    *   `loadTypes`: Loads object types.
    *   `adtDiscovery`: Performs ADT discovery.
    *   `adtCoreDiscovery`: Performs ADT core discovery.
    *   `adtCompatibiliyGraph`: Retrieves the ADT compatibility graph.
*   **Unit Tests:**
    *   `unitTestRun`: Runs unit tests.
    *   `unitTestEvaluation`: Evaluates unit test results.
    *   `unitTestOccurrenceMarkers`: Retrieves unit test occurrence markers.
    *   `createTestInclude`: Creates a test include for a class.
*   **Pretty Printer:**
    *   `prettyPrinterSetting`: Retrieves the pretty printer settings.
    *   `setPrettyPrinterSetting`: Sets the pretty printer settings.
    *   `prettyPrinter`: Formats ABAP code using the pretty printer.
*   **Git:**
    *   `gitRepos`: Retrieves a list of Git repositories.
    *   `gitExternalRepoInfo`: Retrieves information about an external Git repository.
    *   `gitCreateRepo`: Creates a new Git repository.
    *   `gitPullRepo`: Pulls changes from a Git repository.
    *   `gitUnlinkRepo`: Unlinks a Git repository.
    *   `stageRepo`: Stages changes in a Git repository.
    *   `pushRepo`: Pushes changes to a Git repository.
    *   `checkRepo`: Checks a Git repository.
    *   `remoteRepoInfo`: Retrieves information about a remote Git repository.
    *   `switchRepoBranch`: Switches the branch of a Git repository.
*   **DDIC:**
    *   `annotationDefinitions`: Retrieves annotation definitions.
    *   `ddicElement`: Retrieves information about a DDIC element.
    *   `ddicRepositoryAccess`: Accesses the DDIC repository.
    *   `packageSearchHelp`: Performs a package search help.
*   **Service Bindings:**
    *   `publishServiceBinding`: Publishes a service binding.
    *   `unPublishServiceBinding`: Unpublishes a service binding.
    *   `bindingDetails`: Retrieves details of a service binding.
*   **Queries:**
    *   `tableContents`: Retrieves the contents of an ABAP table.
    *   `runQuery`: Runs a SQL query on the target system.
*   **Feeds & Dumps:**
    *   `feeds`: Retrieves a list of feeds.
    *   `dumps`: Retrieves a list of dumps.
*   **Debugger:**
    *   `debuggerListeners`: Retrieves a list of debugger listeners.
    *   `debuggerListen`: Listens for debugging events.
    *   `debuggerDeleteListener`: Stops a debug listener.
    *   `debuggerSetBreakpoints`: Sets breakpoints.
    *   `debuggerDeleteBreakpoints`: Deletes breakpoints.
    *   `debuggerAttach`: Attaches the debugger.
    *   `debuggerSaveSettings`: Saves debugger settings.
    *   `debuggerStackTrace`: Retrieves the debugger stack trace.
    *   `debuggerVariables`: Retrieves debugger variables.
    *   `debuggerChildVariables`: Retrieves child variables of a debugger variable.
    *   `debuggerStep`: Performs a debugger step.
    *   `debuggerGoToStack`: Navigates to a specific stack entry in the debugger.
    *   `debuggerSetVariableValue`: Sets the value of a debugger variable.
*   **Rename Refactoring:**
    *   `renameEvaluate`: Evaluates a rename refactoring.
    *   `renamePreview`: Previews a rename refactoring.
    *   `renameExecute`: Executes a rename refactoring.
*   **ATC:**
    *   `atcCustomizing`: Retrieves ATC customizing information.
    *   `atcCheckVariant`: Retrieves information about an ATC check variant.
    *   `createAtcRun`: Creates an ATC run.
    *   `atcWorklists`: Retrieves ATC worklists.
    *   `atcUsers`: Retrieves a list of ATC users.
    *   `atcExemptProposal`: Retrieves an ATC exemption proposal.
    *   `atcRequestExemption`: Requests an ATC exemption.
    *   `isProposalMessage`: Checks if a given object is a proposal message.
    *   `atcContactUri`: Retrieves the contact URI for an ATC finding.
    *   `atcChangeContact`: Changes the contact for an ATC finding.
*   **Trace:**
    *   `tracesList`: Retrieves a list of traces.
    *   `tracesListRequests`: Retrieves a list of trace requests.
    *   `tracesHitList`: Retrieves the hit list for a trace.
    *   `tracesDbAccess`: Retrieves database access information for a trace.
    *   `tracesStatements`: Retrieves statements for a trace.
    *   `tracesSetParameters`: Sets trace parameters.
    *   `tracesCreateConfiguration`: Creates a trace configuration.
    *   `tracesDeleteConfiguration`: Deletes a trace configuration.
    *   `tracesDelete`: Deletes a trace.
*   **Extract Method Refactoring:**
    *   `extractMethodEvaluate`: Evaluates an extract method refactoring.
    *   `extractMethodPreview`: Previews an extract method refactoring.
    *   `extractMethodExecute`: Executes an extract method refactoring.
*   **Revisions:**
    *   `revisions`: Retrieves revisions for an object.

**Workflow for Modifying ABAP Code:**

1.  **Find the object URI:** Use `searchObject`.
2.  **Read the original source code:** Use `getObjectSource` (with the `/source/main` suffix).
3.  **Clone and Modify the source code locally:** (e.g., `write_to_file` for creating a local copy, and using `read_file`, `replace_in_file` for modifying this local copy).
4.  **Get transport information:** Use `transportInfo`.
5.  **Lock the object:** Use `lock`.
6.  **Set the modified source code:** Use `setObjectSource` (with the `/source/main` suffix).
7.  **Perform a syntax check:** Use `syntaxCheckCode`.
8.  **Activate** the object: Use `activateByName` (or `activateObjects`).
9.  **unLock the object:** Use `unLock`.

**Important Notes:**
*   **File Handling:** SAP is completly de-coupled from the local file system. Reading source code will only return the code as tool result - it has no effect on file. Files are not synchronized with SAP but merely a local copy for our reference. FYI: It's not strictly necessary for you to create local copies of source codes, as they have no effect on SAP, but it helps us track changes. 
*   **File Handling:** The local filenames you will use will not contain any paths, but only a filename! It's preferable to use a pattern like "[ObjectName].[ObjectType].abap". (e.g., SAPMV45A.prog.abap for a ABAP Program SAPMV45A, CL_IXML.clas.abap for a Class CL_IXML)
*   **URL Suffix:**  Remember to add `/source/main` to the object URI when using `setObjectSource` and `getObjectSource`.
*   **Transport Request:** Obtain the transport request number (e.g., from `transportInfo` or from the user) and include it in relevant operations.
*   **Lock Handle:**  The `lockHandle` obtained from the `lock` operation is crucial for `setObjectSource` and `unLock`. Ensure you are using a valid `lockHandle`. If a lock fails, you may need to re-acquire the lock. Locks can expire or be released by other users.
*   **Activation/Unlocking Order:** The exact order of `activateByName`/`activateObjects` and `unLock` operations might need clarification. Refer to the tool descriptions or ask the user.
* **Error Handling:** The tools return JSON responses. Check for error messages within these responses.

## Efficient Database Access

SAP systems contain vast amounts of data.  It's crucial to write ABAP code that accesses the database efficiently to minimize performance impact and network traffic.  Avoid selecting entire tables or using broad `WHERE` clauses when you only need specific data.

*   **Use `WHERE` clauses:** Always use `WHERE` clauses in your `SELECT` statements to filter the data retrieved from the database.  Select only the specific rows you need.
*   **`UP TO 1 ROWS`:** If you only need a single record, use the `SELECT SINGLE` statement, if you can guarantee that you can provide ALL the key fields for the `SELECT SINGLE` statement. Otherwise, use the `SELECT` statement with the `UP TO 1 ROWS` addition. This tells the database to stop searching after finding the first matching record, improving performance. Example:

    ```abap
    SELECT vgbel FROM vbrp WHERE vbeln = @me->lv_vbeln INTO @DATA(lv_vgbel) UP TO 1 ROWS.
      EXIT. " Exit any loop after this.
    ENDSELECT.
    ```
## Checking Table and Structure Definitions

When working with ABAP objects, you may encounter errors related to unknown field names or incorrect table usage.  You can use the following tools to inspect table and structure definitions:

*   **`ddicElement`:** Use this tool to retrieve metadata for DDIC elements (tables/structures/views), including field names and data types. This is helpful for verifying the correct fields to use in your `SELECT` statements.
*   **`ddicRepositoryAccess`:** Use this tool to browse/read DDIC repository content if you need additional context around a DDIC element.

```

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. **Fork the Repository**
2. **Create a New Branch**

   ```cmd
   git checkout -b feature/your-feature-name
   ```

3. **Commit Your Changes**

   ```cmd
   git commit -m "Add some feature"
   ```

4. **Push to the Branch**

   ```cmd
   git push origin feature/your-feature-name
   ```

5. **Open a Pull Request**

## License

This project is licensed under the [MIT License](LICENSE).
