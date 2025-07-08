import { window } from 'vscode';
import * as path from 'path';
import * as Constants from '../../common/constants';
import { EnvironmentController } from '../../controllers/environmentController';
import { SystemSettings } from '../../models/configurationSettings';
import { ResolveErrorMessage } from '../../models/httpVariableResolveResult';
import { VariableType } from '../../models/variableType';
import { HttpVariable, HttpVariableProvider } from './httpVariableProvider';
import { JsonFileUtility } from '../jsonFileUtility';

export class EnvironmentVariableProvider implements HttpVariableProvider {
    private static _instance: EnvironmentVariableProvider;

    private readonly _settings: SystemSettings = SystemSettings.Instance;

    public static get Instance(): EnvironmentVariableProvider {
        if (!this._instance) {
            this._instance = new EnvironmentVariableProvider();
        }

        return this._instance;
    }

    private constructor() {
    }

    public readonly type: VariableType = VariableType.Environment;

    public async has(name: string): Promise<boolean> {
        const variables = await this.getAvailableVariables();
        return name in variables;
    }

    public async get(name: string): Promise<HttpVariable> {
        const variables = await this.getAvailableVariables();
        if (!(name in variables)) {
            return { name, error: ResolveErrorMessage.EnvironmentVariableNotExist };
        }

        return { name, value: variables[name] };
    }

    public async getAll(): Promise<HttpVariable[]> {
        const variables = await this.getAvailableVariables();
        return Object.keys(variables).map(key => ({ name: key, value: variables[key]}));
    }

    private async getAvailableVariables(): Promise<{ [key: string]: string }> {
        let { name: environmentName } = await EnvironmentController.getCurrentEnvironment();
        if (environmentName === Constants.NoEnvironmentSelectedName) {
            environmentName = EnvironmentController.sharedEnvironmentName;
        }
        const variables = this._settings.environmentVariables;
        let currentEnvironmentVariables = variables[environmentName];
        let sharedEnvironmentVariables = variables[EnvironmentController.sharedEnvironmentName];

        const activeEnvironmentFile = window.activeTextEditor ? path.join(path.dirname(window.activeTextEditor.document.fileName), 'http-client.env.json') : undefined;
        const activeEnvironmentFileVariables = await JsonFileUtility.deserializeFromFile<{ [key: string]: { [key: string]: string } }>(activeEnvironmentFile || '', {});
        const currentActiveEnvironmentFileVariables = activeEnvironmentFileVariables[environmentName];
        const sharedActiveEnvironmentFileVariables = activeEnvironmentFileVariables[EnvironmentController.sharedEnvironmentName];

        // Resolve mappings from shared environment
        this.mapEnvironmentVariables('shared', sharedEnvironmentVariables, sharedEnvironmentVariables);
        this.mapEnvironmentVariables('shared', sharedActiveEnvironmentFileVariables, sharedActiveEnvironmentFileVariables);
        sharedEnvironmentVariables = {...sharedEnvironmentVariables, ...sharedActiveEnvironmentFileVariables}
        currentEnvironmentVariables = {...currentEnvironmentVariables, ...currentActiveEnvironmentFileVariables}
        this.mapEnvironmentVariables('shared', currentEnvironmentVariables, sharedEnvironmentVariables);

        // Resolve mappings from current environment
        this.mapEnvironmentVariables(environmentName, currentEnvironmentVariables, currentEnvironmentVariables);
        return {...sharedEnvironmentVariables, ...currentEnvironmentVariables};
    }

    private mapEnvironmentVariables(environment: string, current: { [key: string]: string }, shared: { [key: string]: string }) {
        for (const [key, value] of Object.entries(current)) {
            const variableRegex = new RegExp(`\\{{2}\\$${environment} (.+?)\\}{2}`);
            const match = variableRegex.exec(value);

            if (!match) {
                continue;
            }

            const referenceKey = match[1].trim();

            current[key] = current[key]!.replace(
                variableRegex,
                shared[referenceKey]!);
        }
    }
}
