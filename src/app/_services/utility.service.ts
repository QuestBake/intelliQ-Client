import { RoleType, ResponseStatus } from "../_models/enums";
import { AppResponse } from "../_models/app-response.model";
import { NotificationService } from "./notification.service";
import { Injectable } from "@angular/core";


@Injectable()
export class UtilityService {

    constructor(private notificationService: NotificationService) { }

    getRoleDescription(roleType: RoleType) {
        switch (roleType) {
            case RoleType.SUPERADMIN:
                return "super-admin";

            case RoleType.GROUPADMIN:
                return "group-admin";

            case RoleType.SCHOOLADMIN:
                return "school-admin";

            case RoleType.APPROVER:
                return "approver";

            case RoleType.TEACHER:
                return "teacher";

        }
    }
    getRoleCode(roleDesc: String): any {
        switch (roleDesc) {
            case "super-admin":
                return 0;

            case "group-admin":
                return 1;

            case "school-admin":
                return 2;

            case "approver":
                return 3;

            case "teacher":
                return 4;
            default:
                return "";
        }
    }

    getAppResponse(appResponse: AppResponse, showError: boolean, showSuccess: boolean) {
        var timeOut = 3000;
        if (appResponse.status === ResponseStatus.ERROR) {
            if (showError) {
                this.notificationService.showErrorWithTimeout(appResponse.msg, null, timeOut);
            }
            return null;
        }
        else if (appResponse.status === ResponseStatus.SUCCESS) {
            if (showSuccess) {
                this.notificationService.showSuccessWithTimeout(appResponse.body, null, timeOut);
            }
            return appResponse.body;
        }
    }

}