import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { AppConfigurationClient } from "@azure/app-configuration";

interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
}

const httpGetProductList: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
    try {
        const connectionString = process.env.AZURE_APP_CONFIG_CONNECTION_STRING;
        const client = new AppConfigurationClient(connectionString);

        const setting = await client.getConfigurationSetting({ key: "DATA_FROM_APP_CONFIG" });
        const products: Product[] = JSON.parse(setting.value as string);
        context.log('Test');
        context.res = {
            status: 200,
            body: products,
        };
    } catch (error: any) {
        context.res = {
            status: 500,
            body: {
                message: "Failed to load product list",
                error: error.message,
            },
        };
    }
};

export default httpGetProductList;