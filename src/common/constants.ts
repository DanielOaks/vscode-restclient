
export const ExtensionId: string = 'humao.rest-client';
export const AiKey: string = 'ad746e27-4a36-441c-8b94-5db178f81ae3';

export const NoEnvironmentSelectedName: string = 'c0cfe680-4fcd-4b71-a4ba-8cfaee57680a';

export const TimeStampVariableName = "$timestamp";
export const TimeStampVariableDescription = "Add a number of milliseconds between 1970/1/1 UTC Time and now. \
 You can also provide the offset with current time in the format {{$timestamp number string}}";
export const DateTimeVariableName = "$datetime";
export const DateTimeVariableNameDescription = "Add a datetime string in either ISO8601 or RFC1123 format";
export const LocalDateTimeVariableName = "$localDatetime";
export const LocalDateTimeVariableNameDescription = "Add a local datetime string in either ISO8601 or RFC1123 format";
export const GuidVariableName = "$guid";
export const GuidVariableDescription = "Add a RFC 4122 v4 UUID";
export const RandomIntVariableName = "$randomInt";
export const RandomIntDescription = "Returns a random integer between min (included) and max (excluded)";
export const RandomAlphaVariableName = "$randomAlpha";
export const RandomAlphaDescription = "Returns a random set of a-zA-Z characters of the given length";
export const RandomNameVariableName = "$randomName";
export const RandomNameDescription = "Returns a random name";
export const ProcessEnvVariableName = "$processEnv";
export const ProcessEnvDescription = "Returns the value of process environment variable or '' if not found ";
export const DotenvVariableName = "$dotenv";
export const DotenvDescription = "Returns the environment value stored in a .env file";
export const AzureActiveDirectoryVariableName = "$aadToken";
export const AzureActiveDirectoryDescription = "Prompts to sign in to Azure AD and adds the token to the request";
export const AzureActiveDirectoryV2TokenVariableName = "$aadV2Token";
export const AzureActiveDirectoryV2TokenDescription = "Prompts to sign in to Azure AD V2 and adds the token to the request";

export const OidcVariableName = "$oidcAccessToken";
export const OidcDescription = "Prompts to sign in to an Oidc provider and adds the token to the request";
export const OIdcForceNewOption = "new";


/**
 * NOTE: The client id represents an AAD app people sign in to. The client id is sent to AAD to indicate what app
 * is requesting a token for the user. When the user signs in, AAD shows the name of the app to confirm the user is
 * authorizing the right app to act on their behalf. We're using Visual Studio Code's client id since that is the
 * overarching app people will think of when they are signing in.
 */
export const AzureActiveDirectoryClientId = "aebc6443-996d-45c2-90f0-388ff96faa56";
export const AzureActiveDirectoryForceNewOption = "new";
export const AzureActiveDirectoryDefaultTenantId = "common";
export const AzureActiveDirectoryDefaultDisplayName = "Default Directory";
export const AzureClouds: { [key: string]: { aad: string, arm: string, armAudience?: string } } = {
    // default cloud must be first
    public: {
        aad: "https://login.microsoftonline.com/",
        arm: "https://management.azure.com/",
    },
    cn: {
        aad: "https://login.chinacloudapi.cn/",
        arm: "https://management.chinacloudapi.cn/",
    },
    de: {
        aad: "https://login.microsoftonline.de/",
        arm: "https://management.microsoftazure.de/",
    },
    us: {
        aad: "https://login.microsoftonline.us/",
        arm: "https://management.usgovcloudapi.net/",
    },
    ppe: {
        aad: "https://login.windows-ppe.net/",  // for testing purposes only
        arm: "https://api-dogfood.resources.windows-int.net/",
        armAudience: "https://management.azure.com/",
    },
};

export const RequestMetadataRegex: RegExp = /^\s*(?:#|\/{2})\s*@([\w-]+)(?:\s+(.*?))?\s*$/;

export const CommentIdentifiersRegex: RegExp = /^\s*(#|\/{2})/;

export const FileVariableDefinitionRegex: RegExp = /^\s*@([^\s=]+)\s*=\s*(.*?)\s*$/;

export const RequestVariableDefinitionWithNameRegexFactory = (name: string, flags?: string): RegExp =>
    new RegExp(`^\\s*(?:#{1,}|\\/{2,})\\s+@name\\s+(${name})\\s*$`, flags);

export const RequestVariableDefinitionRegex: RegExp = RequestVariableDefinitionWithNameRegexFactory("\\w+", "m");

export const PromptCommentRegex = /^\s*(?:#{1,}|\/{2,})\s*@prompt\s+([^\s]+)(?:\s+(.*))?\s*$/;

export const LineSplitterRegex: RegExp = /\r?\n/g;