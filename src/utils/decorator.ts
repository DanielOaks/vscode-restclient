export function trace(eventName: string): MethodDecorator {
    return (target, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value;

        descriptor.value = function(...args: any[]) {
            console.log("restclient:", eventName);
            return originalMethod.apply(this, args);
        };

        return descriptor;
    };
}