Collect & Claim Logic:

Single-page scenario:

If there is only one page (detectable from 1 of 1 in the element [insert element]), the script should first check for any available tasks by executing the standard collect and claim functions.

If one or more tasks are successfully collected and claimed, proceed as usual.

If no tasks are collected (detectable from the popup message “Please Select task” in [insert element]), the script should click OK in [insert element] and then:

Repeatedly input 1 into the field [insert element] every 2 seconds, immediately attempting to claim and collect after each input for 1 second, until either:

A task is successfully collected and claimed, or

New pages appear (detectable when 1 of 1 changes to 1 of n, where n is the total number of pages in [insert element]).

Multiple-page scenario:

If multiple pages exist, the script should navigate to the last page using the button in [insert element] and attempt to collect and claim tasks from that page.

Popup handling:

Occasionally, after collecting and claiming, a success popup may remain on screen. In this case, the script should click the OK (red) button located in [insert element] to dismiss it.