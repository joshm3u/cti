// ==UserScript==
// @name         CTI select test
// @namespace    http://mcm.amazon.com/
// @version      0.3
// @description  Cable Installation helper
// @author       chengng@
// @match        https://mcm.amazon.com/cms/new?from_template=d3a442df-63cb-49b6-8501-60a202a1fa59
// @updateURL  https://raw.githubusercontent.com/joshm3u/cable-install-MCM-helper/main/cable%20helper.js
// @downloadURL https://raw.githubusercontent.com/joshm3u/cable-install-MCM-helper/main/cable%20helper.js
// @grant        none
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// ==/UserScript==

/*
REVISION HISTORY:
0.1 - 2023-09-13 - chengng@ - Initial setup for the helper
0.2 - 2023-09-19 - chengng@ - Remove approvers and Add Tier selection based on the MCM type
0,3 - 2023-09-25 - chengng@ - Change title to ID EDGE and NDE cutsheet also auto-populated from primary ticket
*/

(function() {
    'use strict';

    // Function to extract content between square brackets
    function extractContent(inputString, startChar, endChar, occurrence) {
        const regex = new RegExp(`\\${startChar}(.*?)\\${endChar}`, 'gi'); // Case-insensitive regex
        const matches = inputString.match(regex);
        if (matches && matches.length >= occurrence) {
            return matches[occurrence - 1].slice(1, -1); // Remove the brackets
        }
        return '';
    }

    // Function to set the value of a textarea by its ID
    function setTextareaValue(id, value) {
        const textarea = document.getElementById(id);
        if (textarea) {
            textarea.value = value;
        }
    }

    // Function to replace a placeholder in a textarea with a specific name
    function replacePlaceholderInTextarea(textareaName, placeholder, replacement) {
        const textarea = document.querySelector(`textarea[name="${textareaName}"]`);
        if (textarea) {
            const text = textarea.value;
            const regex = new RegExp(placeholder, "g");
            const newText = text.replace(regex, replacement);
            textarea.value = newText;
        }
    }

    // Function to replace a placeholder in an input field with a specific name
    function replacePlaceholderInInput(inputName, placeholder, replacement) {
        const inputField = document.querySelector(`input[name="${inputName}"]`);
        if (inputField) {
            inputField.value = inputField.value.replace(placeholder, replacement);
        }
    }

        // Function to click the "Delete" buttons
    function clickDeleteButtons() {
        var deleteButtons = document.querySelectorAll('a.delete-approver'); // Select all elements with class 'delete-approver'

        // Loop through the delete buttons and click them
        deleteButtons.forEach(function(button) {
            var dataApprover = button.getAttribute('data-approver');
            if (dataApprover === 'l2-id-mcmbr' || dataApprover === 'l3-id-approval') {
                button.click();
            }
        });
    }

    // Read user inputs from the clipboard
    navigator.clipboard.readText().then(function(clipboardText) {
        const clipboardLines = clipboardText.split('\n');
        const userinput1 = clipboardLines[0] || '';
        const userinput4 = clipboardLines[1] || '';
        const userinput3 = clipboardLines[2] || '';
        const userinput7 = clipboardLines[3] || '';
        const NDEcutsheet = clipboardLines[5] || '';

        // Prompt for userinput5 (05_vendor_name)
        const userinput5 = prompt("Enter 05_vendor_name:");

        // Prompt for userinput6 (06_vendor_POC_information)
        const userinput6 = prompt("Enter 06_vendor_POC_information:");

        // Define predefined values for userinputs 8 to 23
        const userinput8 = "N/A";
        const userinput9 = "No";
        const userinput10 = "See attached cutsheet";
        const userinput11 = "See attached cutsheet";
        const userinput14 = "Normal business hour";
        const userinput15 = "No";
        const userinput16 = "Yes" + (NDEcutsheet ? ` - ${NDEcutsheet}` : "");
        const userinput17 = "Non-intrusive";
        const userinput18 = "Yes";
        const userinput19 = "New Cable Installations is Tier 4 as per https://w.amazon.com/bin/view/GlobalEdge/Documentation/MCM/";
        const userinput20 = "Day 1-2: Vendor prepare the cabling material and labels\nDay 3-5: Vendor doing cable installation according to SOW, cutsheet and AWS standard;\nDay 6: Removal of rubbish at the end";
        const userinput21 = "Impact could cause interface flapping which could cause customer impact";
        const userinput22 = "Fibers could be bumped, jarred, and bent during installations";
        const userinput23 = "1.) In the event that impact is detected by EDGE OPS oncall, EDGE Projects will immediately halt work.\n2.) Edge Projects will standby for directions provided by EDGE OPS oncall to assist in mitigation of impact.\n3.) EDGE Projects will perform said directed activities and inform EDGE OPS oncall of expected recovery.\n4.) EDGE Projects will then confirm recovery and re-evaluate if work can re-continue alongside EDGE OPS.";

         // Define userinput2 based on userinput3 content
        let userinput2;
        if (userinput3.toLowerCase().includes("fnc") || userinput3.toLowerCase().includes("bwit") || userinput3.toLowerCase().includes("homestead") ||
            userinput3.toLowerCase().includes("bmn") || userinput3.toLowerCase().includes("ubiquity") || userinput3.toLowerCase().includes("optical")) {
            userinput2 = "border";
        } else if (userinput3.toLowerCase().includes("dx")) {
            userinput2 = "DX";
        } else if (userinput3.toLowerCase().includes("lci")) {
            userinput2 = "border"; // Define userinput2 as "border" for LCI
        } else if (userinput3.toLowerCase().includes("p1") || userinput3.toLowerCase().includes("p2") || userinput3.toLowerCase().includes("p3") ||
            userinput3.toLowerCase().includes("p4") || userinput3.toLowerCase().includes("p5") || userinput3.toLowerCase().includes("p6") ||
            userinput3.toLowerCase().includes("p7") || userinput3.toLowerCase().includes("p8") || userinput3.toLowerCase().includes("p9") ||
            userinput3.toLowerCase().includes("cf") || userinput3.toLowerCase().includes("r53") || userinput3.toLowerCase().includes("bwie")) {
            userinput2 = "CF";
        } else {
            userinput2 = "other";
        }

        // Set values in textareas by their IDs ==> this is for template info area
        setTextareaValue('templateVariables[{{01_site}}]', userinput1);
        setTextareaValue('templateVariables[{{02_fabric_or_service_name}}]', userinput2);
        setTextareaValue('templateVariables[{{03_project_name}}]', userinput3);
        setTextareaValue('templateVariables[{{04_FBN}}]', userinput4);
        setTextareaValue('templateVariables[{{05_vendor_name}}]', userinput5);
        setTextareaValue('templateVariables[{{06_vendor_POC_information}}]', userinput6);
        setTextareaValue('templateVariables[{{07_primary_sim_URL}}]', userinput7);
        setTextareaValue('templateVariables[{{08_vendor_walkthrough_MCM}}]', userinput8);
        setTextareaValue('templateVariables[{{09_Is_this_MCM_a_continuation_of_a_previous_MCM_if_yes_list_them_below_and_attach_them_in_related_items}}]', userinput9);
        setTextareaValue('templateVariables[{{10_number_of_affected_devices_cabling_is_being_installed_for}}]', userinput10);
        setTextareaValue('templateVariables[{{11_number_of_connections_to_be_ran}}]', userinput11);
        setTextareaValue('templateVariables[{{14_why_is_this_the_correct_time_and_day_to_complete_the_mcm}}]', userinput14);
        setTextareaValue('templateVariables[{{15_are_there_any_related_MCMs_that_must_be_completed_before_this_change_occurs}}]', userinput15);
        setTextareaValue('templateVariables[{{16_are_the_Cut_sheet_MCMs_in_a_fully_approved_state_if_yes_list_them_below_and_attach_them_in_related_items}}]', userinput16);
        setTextareaValue('templateVariables[{{17_if_this_MCM_is_intrusive_what_services_will_be_affected}}]', userinput17);
        setTextareaValue('templateVariables[{{18_have_we_segmented_this_change_into_small_enough_stages_to_minimize_the_blast_radius_accelerate_impact_detection_and_ease_rollback}}]', userinput18);
        setTextareaValue('templateVariables[{{19_what_is_the_justification_for_this_tier_level}}]', userinput19);
        setTextareaValue('templateVariables[{{20_timeline_or_activity_plan}}]', userinput20);
        setTextareaValue('templateVariables[{{21_what_could_happen_if_this_change_causes_impact}}]', userinput21);
        setTextareaValue('templateVariables[{{22_where_are_the_most_likely_places_this_change_will_fail}}]', userinput22);
        setTextareaValue('templateVariables[{{23_describe_rollback_plan}}]', userinput23);

        // Replace placeholders with specific names in textareas  ==> this is for MCM description area
        replacePlaceholderInTextarea('description', '{{01_site}}', userinput1);
        replacePlaceholderInTextarea('description', '{{02_fabric_or_service_name}}', userinput2);
        replacePlaceholderInTextarea('description', '{{03_project_name}}', userinput3);
        replacePlaceholderInTextarea('description', '{{04_FBN}}', userinput4);
        replacePlaceholderInTextarea('description', '{{05_vendor_name}}', userinput5);
        replacePlaceholderInTextarea('description', '{{06_vendor_POC_information}}', userinput6);
        replacePlaceholderInTextarea('description', '{{07_primary_sim_URL}}', userinput7);
        replacePlaceholderInTextarea('description', '{{08_vendor_walkthrough_MCM}}', userinput8);
        replacePlaceholderInTextarea('description', '{{09_Is_this_MCM_a_continuation_of_a_previous_MCM_if_yes_list_them_below_and_attach_them_in_related_items}}', userinput9);
        replacePlaceholderInTextarea('description', '{{10_number_of_affected_devices_cabling_is_being_installed_for}}', userinput10);
        replacePlaceholderInTextarea('description', '{{11_number_of_connections_to_be_ran}}', userinput11);
        replacePlaceholderInTextarea('description', '{{14_why_is_this_the_correct_time_and_day_to_complete_the_mcm}}', userinput14);
        replacePlaceholderInTextarea('description', '{{15_are_there_any_related_MCMs_that_must_be_completed_before_this_change_occurs}}', userinput15);
        replacePlaceholderInTextarea('description', '{{16_are_the_Cut_sheet_MCMs_in_a_fully_approved_state_if_yes_list_them_below_and_attach_them_in_related_items}}', userinput16);
        replacePlaceholderInTextarea('description', '{{17_if_this_MCM_is_intrusive_what_services_will_be_affected}}', userinput17);
        replacePlaceholderInTextarea('description', '{{18_have_we_segmented_this_change_into_small_enough_stages_to_minimize_the_blast_radius_accelerate_impact_detection_and_ease_rollback}}', userinput18);
        replacePlaceholderInTextarea('description', '{{19_what_is_the_justification_for_this_tier_level}}', userinput19);
        replacePlaceholderInTextarea('description', '{{20_timeline_or_activity_plan}}', userinput20);
        replacePlaceholderInTextarea('description', '{{21_what_could_happen_if_this_change_causes_impact}}', userinput21);
        replacePlaceholderInTextarea('description', '{{22_where_are_the_most_likely_places_this_change_will_fail}}', userinput22);
        replacePlaceholderInTextarea('description', '{{23_describe_rollback_plan}}', userinput23);

        // Replace MCM title area
        replacePlaceholderInInput('title', 'ID', 'ID EDGE');
        replacePlaceholderInInput('title', '{{01_site}}', userinput1);
        replacePlaceholderInInput('title', '{{02_fabric_or_service_name}}', userinput2);
        replacePlaceholderInInput('title', '{{03_project_name}}', userinput3);
        replacePlaceholderInInput('title', '{{04_FBN}}', userinput4);
        replacePlaceholderInInput('title', '{{05_vendor_name}}', userinput5);

        // Display a final reminder alert
        alert("Don't forget to do following manual tasks:\nA)Double check the above information before submitting for approval\nB)Update 12_all_hostnames\nC)Update 13_patch_panels_locations\nD)Adjust 18_detailed onsite plan accordingly");
    });

        // Run the function when the page is fully loaded
    window.addEventListener('load', function() {
        clickDeleteButtons();
    });

// Function to set the selected category based on userinput2 and trigger the type selection
function setCategoryAndTriggerTypeSelection() {
    let selectedCategoryValue;
    if (window.userinput2 === "CF") {
        selectedCategoryValue = "Deployment- CF";
    } else if (window.userinput2 === "DX") {
        selectedCategoryValue = "Deployment- DX";
    } else if (window.userinput2 === "border") {
        selectedCategoryValue = "Deployment- Border";
    } else {
        selectedCategoryValue = "InfraDelivery-Edge";
    }

    // Set the value for selected_category
    $("#selected_category").val(selectedCategoryValue);

    // Trigger the change event to execute updateType
    $("#cti_category").val(selectedCategoryValue).trigger('change');
}

// Run the function when the page is fully loaded
window.addEventListener('load', function() {
    setCategoryAndTriggerTypeSelection();
});

// Function to select an option by value in a select element by ID
function selectOptionByValue(selectId, value) {
    const selectElement = document.getElementById(selectId);
    if (selectElement) {
        for (const option of selectElement.options) {
            if (option.value === value) {
                option.selected = true;
                break;
            }
        }
    }
}
// Call the function to select "Tier 4" in the 'tier' select element
selectOptionByValue('tier', 'Tier 4');




})();
