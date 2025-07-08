import { EventEmitter, QuickPickItem, window } from 'vscode';
import * as path from 'path';
import * as Constants from '../common/constants';
import { SystemSettings } from '../models/configurationSettings';
import { trace } from "../utils/decorator";
import { EnvironmentStatusEntry } from '../utils/environmentStatusBarEntry';
import { UserDataManager } from '../utils/userDataManager';
import Logger from '../logger';
import { JsonFileUtility } from '../utils/jsonFileUtility';

type EnvironmentPickItem = QuickPickItem & { name: string };

export class EnvironmentController {
    private static readonly noEnvironmentPickItem: EnvironmentPickItem = {
        label: 'No Environment',
        name: Constants.NoEnvironmentSelectedName,
        description: 'You can still use variables defined in the $shared environment'
    };

    public static readonly sharedEnvironmentName: string = '$shared';

    private static readonly _onDidChangeEnvironment = new EventEmitter<string>();

    public static readonly onDidChangeEnvironment = EnvironmentController._onDidChangeEnvironment.event;

    private readonly settings: SystemSettings = SystemSettings.Instance;

    private environmentStatusEntry: EnvironmentStatusEntry;

    private currentEnvironment: EnvironmentPickItem;

    private constructor(initEnvironment: EnvironmentPickItem) {
        this.currentEnvironment = initEnvironment;
        this.environmentStatusEntry = new EnvironmentStatusEntry(initEnvironment.label);
    }

    @trace('Switch Environment')
    public async switchEnvironment() {
        // Add no environment at the top
        let environmentNames = Object.keys(this.settings.environmentVariables)

        const filesToLoadEnvVariablesFrom = Array.from(new Set(
            window.visibleTextEditors
                .map(editor => path.dirname(editor.document.fileName))
                .filter(folder => folder !== '.')
                .map(folder => path.join(folder, 'http-client.env.json'))));
        Logger.info('Loading extra http-client.env.json files from:', filesToLoadEnvVariablesFrom)
        for (const envFilename of filesToLoadEnvVariablesFrom) {
            const environments = await JsonFileUtility.deserializeFromFile<{ [key: string]: { [key: string]: string } }>(envFilename, {});
            environmentNames.push(...Object.keys(environments));
        }

        const userEnvironments: EnvironmentPickItem[] =
            Array.from(new Set(environmentNames))
                .filter(name => name !== EnvironmentController.sharedEnvironmentName)
                .map(name => ({
                    name,
                    label: name,
                    description: name === this.currentEnvironment.name ? '$(check)' : undefined
                }));

        const itemPickList: EnvironmentPickItem[] = [EnvironmentController.noEnvironmentPickItem, ...userEnvironments];
        const item = await window.showQuickPick(itemPickList, { placeHolder: "Select REST Client Environment" });
        if (!item) {
            return;
        }

        this.currentEnvironment = item;

        EnvironmentController._onDidChangeEnvironment.fire(item.label);
        this.environmentStatusEntry.update(item.label);

        await UserDataManager.setEnvironment(item);
    }

    public static async create(): Promise<EnvironmentController> {
        const environment = await this.getCurrentEnvironment();
        return new EnvironmentController(environment);
    }

    public static async getCurrentEnvironment(): Promise<EnvironmentPickItem> {
        const currentEnvironment = await UserDataManager.getEnvironment() as EnvironmentPickItem | undefined;
        return currentEnvironment || this.noEnvironmentPickItem;
    }

    public dispose() {
        this.environmentStatusEntry.dispose();
    }
}