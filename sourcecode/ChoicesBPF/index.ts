import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class ChoicesBPF implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private context: ComponentFramework.Context<IInputs>;
    private container: HTMLDivElement;
    private notifyOutputChanged: () => void;
    private Choice: string | null;

    constructor() {}

    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement) {
        this.context = context;
        this.notifyOutputChanged = notifyOutputChanged;
        this.container = container;

        const timelineContainer = document.createElement("div");
        timelineContainer.classList.add("timeline");
        this.container.appendChild(timelineContainer);

        const outerContainer = document.createElement("div");
        outerContainer.classList.add("outer");
        timelineContainer.appendChild(outerContainer);

        let choices = context.parameters.Choice.attributes?.Options;
        const selectedValue: number | undefined | null = this.context.parameters.Choice.raw;
        console.log(selectedValue);

        if (choices != undefined) {
            choices.forEach((item, index) => {
                const card = document.createElement("div");
                card.classList.add("card");

                const infoContainer = document.createElement("div");
                infoContainer.classList.add("info");

                const title = document.createElement("h3");
                title.classList.add("title");
                title.innerText = item.Label;

                if (item.Value == selectedValue) {
                    infoContainer.classList.add("active");
                    title.classList.add("active");
                }

                infoContainer.appendChild(title);
                card.appendChild(infoContainer);
                outerContainer.appendChild(card);

                card.addEventListener('click', () => {
                    document.querySelectorAll('.title').forEach(function (card) {
                        card.classList.remove('active');
                    });
                    document.querySelectorAll('.info').forEach(function (card) {
                        card.classList.remove('active');
                    });
                    title.classList.add('active');
                    infoContainer.classList.add('active');
                    
                    context.parameters.Choice.raw = item.Value;
                    notifyOutputChanged();
                });
            });
        }
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        // Add code to update control view
    }

    public getOutputs(): IOutputs {
        return {
            Choice: this.context.parameters.Choice.raw ?? undefined
        };
    }

    public destroy(): void {
        // Add code to cleanup control if necessary
    }
}
