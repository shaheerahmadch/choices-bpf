import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class ChoicesBPF implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    // The PCF context object\
    private context: ComponentFramework.Context<IInputs>;
    // The wrapper div element for the component\
    private container: HTMLDivElement;
    // The callback function to call whenever your code has made a change to a bound or output property\
    private notifyOutputChanged: () => void;
    // Flag to track if the component is in edit mode or not\
    private isEditMode: boolean;
    // Tracking variable for the name property\
    private Choice: string | null;
    /**
     * Empty constructor.
     */
    constructor() {

    }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
     */
    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement) {

        // Track all the things
        this.context = context;
        this.notifyOutputChanged = notifyOutputChanged;
        this.container = container;
        this.isEditMode = false;

        // Create the timeline container
        const timelineContainer = document.createElement("div");
        timelineContainer.classList.add("timeline");
        this.container.appendChild(timelineContainer);

        // Create the outer container
        const outerContainer = document.createElement("div");
        outerContainer.classList.add("outer");
        timelineContainer.appendChild(outerContainer);

        // Fetch data from context or parameters
        let choices = context.parameters.Choice.attributes?.Options;
        let choiceLogicalName = context.parameters.Choice.attributes?.LogicalName;
        let entityLogicalName = context.parameters.entityName.raw as string;
        let recordID = context.parameters.entityId.raw as string;
        var currentValue = 0;
        context.webAPI.retrieveRecord(entityLogicalName, recordID).then(
            function(result){
                currentValue = result[choiceLogicalName!]
                if (choices != undefined) {
                    choices.forEach((item, index) => {
                        // Create the card element
                        const card = document.createElement("div");
                        card.classList.add("card");
                        
                        // Create the info container
                        const infoContainer = document.createElement("div");
                        infoContainer.classList.add("info");
        
                        // Create the title element
                        const title = document.createElement("h3");
                        title.classList.add("title");
                        title.innerText = item.Label;
                        
                        if (item.Value == currentValue) {
                            infoContainer.classList.add("active");
                            title.classList.add("active");
                        }
                        // Append elements to the respective containers
                        infoContainer.appendChild(title);
                        card.appendChild(infoContainer);
                        outerContainer.appendChild(card);
        
                        // Handle click event for each timeline item
                        card.addEventListener('click', () => {
                            // Remove "active" class from all cards
                            document.querySelectorAll('.title').forEach(function (card) {
                                card.classList.remove('active');
                            });
                            document.querySelectorAll('.info').forEach(function (card) {
                                card.classList.remove('active');
                            });
                            title.classList.add('active');
                            infoContainer.classList.add('active');
                            // Update the Choice property value
                            let data: { [key: string]: any } = {};
                            data[choiceLogicalName!] = item.Value;
                            context.webAPI.updateRecord(entityLogicalName, recordID, data).then(
                                function () {
                                    console.log("success");
                                    notifyOutputChanged()
                                }
                            );
                        });
        
        
                    });
                }
            }
        )
        // Fetch and display timeline items
        
    }



    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     */
    public updateView(context: ComponentFramework.Context<IInputs>): void {
        // Add code to update control view
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs {
        return {};
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
    }
}
