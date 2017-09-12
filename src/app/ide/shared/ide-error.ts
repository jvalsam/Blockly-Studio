/**
 * IDEError - IDE throws errors when detect unexpected states
 *
 * Yannis Valsamakis <jvalsam@ics.forth.gr>
 * July 2017
 */

export class IDEError {
    private static msgCreator(
        ftype: string,
        etype: string,
        msg: string,
        srcInfo?: string
    ): string {
        var errorMsg = etype + ftype + msg;
        if (srcInfo)
            errorMsg += srcInfo;
        return errorMsg;
    }

    static raise(etype: string, msg: string, srcInfo?: string) {
        throw new RangeError(
            IDEError.msgCreator(
                'Error',
                etype,
                msg,
                srcInfo
            )
        );
    }

    static warn(etype: string, msg: string, srcInfo?: string) {
        console.warn(
            IDEError.msgCreator(
                'Warning',
                etype,
                msg,
                srcInfo
            )
        );
    }
}
