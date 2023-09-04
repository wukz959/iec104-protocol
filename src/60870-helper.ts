import { EventEmitter } from 'events'

export function helper(Lib60870) {
    Lib60870.prototype.GetTypeIdValue = function(typeId) {
        for (const [key, value] of Object.entries(Lib60870.prototype.TypeID)) {
            if (typeId === value) {
                return Lib60870.prototype.TypeID[key]
            }
        }
        return null
    }

    Lib60870.prototype.GetCotValue = function(cot) {
        for (const [key, value] of Object.entries(Lib60870.prototype.CauseOfTransmission)) {
            if (cot === value) {
                return Lib60870.prototype.CauseOfTransmission[key]
            }
        }
        return null
    }

    Lib60870.prototype.GetInterrogationCommandValue = function(interrogationCommand) {
        return interrogationCommand
    }

    Lib60870.prototype.QualifierOfInterrogation = class {
        STATION //byte
        GROUP_15 //byte
        GROUP_14 //byte
        GROUP_13 //byte
        GROUP_12 //byte
        GROUP_11 //byte
        GROUP_10 //byte
        GROUP_9 //byte
        GROUP_8 //byte
        GROUP_7 //byte
        GROUP_6 //byte
        GROUP_5 //byte
        GROUP_4 //byte
        GROUP_3 //byte
        GROUP_2 //byte
        GROUP_1 //byte
        GROUP_16 //byte
        //QualifierOfInterrogation();
    }

    Lib60870.prototype.TypeID = {
        M_SP_NA_1 : 1,
        M_SP_TA_1 : 2,
        M_DP_NA_1 : 3,
        M_DP_TA_1 : 4,
        M_ST_NA_1 : 5,
        M_ST_TA_1 : 6,
        M_BO_NA_1 : 7,
        M_BO_TA_1 : 8,
        M_ME_NA_1 : 9,
        M_ME_TA_1 : 10,
        M_ME_NB_1 : 11,
        M_ME_TB_1 : 12,
        M_ME_NC_1 : 13,
        M_ME_TC_1 : 14,
        M_IT_NA_1 : 15,
        M_IT_TA_1 : 16,
        M_EP_TA_1 : 17,
        M_EP_TB_1 : 18,
        M_EP_TC_1 : 19,
        M_PS_NA_1 : 20,
        M_ME_ND_1 : 21,
        M_SP_TB_1 : 30,
        M_DP_TB_1 : 31,
        M_ST_TB_1 : 32,
        M_BO_TB_1 : 33,
        M_ME_TD_1 : 34,
        M_ME_TE_1 : 35,
        M_ME_TF_1 : 36,
        M_IT_TB_1 : 37,
        M_EP_TD_1 : 38,
        M_EP_TE_1 : 39,
        M_EP_TF_1 : 40,
        ASDU_TYPE_41 : 41,
        C_SC_NA_1 : 45,
        C_DC_NA_1 : 46,
        C_RC_NA_1 : 47,
        C_SE_NA_1 : 48,
        C_SE_NB_1 : 49,
        C_SE_NC_1 : 50,
        C_BO_NA_1 : 51,
        C_SC_TA_1 : 58,
        C_DC_TA_1 : 59,
        C_RC_TA_1 : 60,
        C_SE_TA_1 : 61,
        C_SE_TB_1 : 62,
        C_SE_TC_1 : 63,
        C_BO_TA_1 : 64,
        M_EI_NA_1 : 70,
        C_IC_NA_1 : 100,
        C_CI_NA_1 : 101,
        C_RD_NA_1 : 102,
        C_CS_NA_1 : 103,
        C_TS_NA_1 : 104,
        C_RP_NA_1 : 105,
        C_CD_NA_1 : 106,
        C_TS_TA_1 : 107,
        P_ME_NA_1 : 110,
        P_ME_NB_1 : 111,
        P_ME_NC_1 : 112,
        P_AC_NA_1 : 113,
        F_FR_NA_1 : 120,
        F_SR_NA_1 : 121,
        F_SC_NA_1 : 122,
        F_LS_NA_1 : 123,
        F_AF_NA_1 : 124,
        F_SG_NA_1 : 125,
        F_DR_TA_1 : 126,
        F_SC_NB_1 : 127
    }

    Lib60870.prototype.StepCommandValue = {
        INVALID_0 : 0,
        LOWER : 1,
        HIGHER : 2,
        INVALID_3 : 3
    }

    Lib60870.prototype.CauseOfTransmission = {
        PERIODIC : 1,
        BACKGROUND_SCAN : 2,
        SPONTANEOUS : 3,
        INITIALIZED : 4,
        REQUEST : 5,
        ACTIVATION : 6,
        ACTIVATION_CON : 7,
        DEACTIVATION : 8,
        DEACTIVATION_CON : 9,
        ACTIVATION_TERMINATION : 10,
        RETURN_INFO_REMOTE : 11,
        RETURN_INFO_LOCAL : 12,
        FILE_TRANSFER : 13,
        AUTHENTICATION : 14,
        MAINTENANCE_OF_AUTH_SESSION_KEY : 15,
        MAINTENANCE_OF_USER_ROLE_AND_UPDATE_KEY : 16,
        INTERROGATED_BY_STATION : 20,
        INTERROGATED_BY_GROUP_1 : 21,
        INTERROGATED_BY_GROUP_2 : 22,
        INTERROGATED_BY_GROUP_3 : 23,
        INTERROGATED_BY_GROUP_4 : 24,
        INTERROGATED_BY_GROUP_5 : 25,
        INTERROGATED_BY_GROUP_6 : 26,
        INTERROGATED_BY_GROUP_7 : 27,
        INTERROGATED_BY_GROUP_8 : 28,
        INTERROGATED_BY_GROUP_9 : 29,
        INTERROGATED_BY_GROUP_10 : 30,
        INTERROGATED_BY_GROUP_11 : 31,
        INTERROGATED_BY_GROUP_12 : 32,
        INTERROGATED_BY_GROUP_13 : 33,
        INTERROGATED_BY_GROUP_14 : 34,
        INTERROGATED_BY_GROUP_15 : 35,
        INTERROGATED_BY_GROUP_16 : 36,
        REQUESTED_BY_GENERAL_COUNTER : 37,
        REQUESTED_BY_GROUP_1_COUNTER : 38,
        REQUESTED_BY_GROUP_2_COUNTER : 39,
        REQUESTED_BY_GROUP_3_COUNTER : 40,
        REQUESTED_BY_GROUP_4_COUNTER : 41,
        UNKNOWN_TYPE_ID : 44,
        UNKNOWN_CAUSE_OF_TRANSMISSION : 45,
        UNKNOWN_COMMON_ADDRESS_OF_ASDU : 46,
        UNKNOWN_INFORMATION_OBJECT_ADDRESS : 47
    }

    Lib60870.prototype.ConnectionEvent = {
        OPENED : 0,
        CLOSED : 1,
        STARTDT_CON_RECEIVED : 2,
        STOPDT_CON_RECEIVED : 3,
        CONNECT_FAILED : 4
    }

    Lib60870.prototype.ParseInformationObjectAddress = function(parameters, msg, startIndex) {
        if (msg.length - startIndex < parameters.SizeOfIOA) {
            throw new Lib60870.prototype.ASDUParsingException('Message to short')
        }
        let ioa = msg[startIndex]
        if (parameters.SizeOfIOA > 1) {
            ioa += (msg[startIndex + 1] * 0x100)
        }
        if (parameters.SizeOfIOA > 2) {
            ioa += (msg[startIndex + 2] * 0x10000)
        }
        return ioa
    }
    Lib60870.prototype.informationObjects = {}
    class eventEmitter extends EventEmitter {}
    Lib60870.prototype.eventEmitter = new eventEmitter()

    let timer: any = null
    function debounce(func, timeout = 300) {
        const args = arguments
        clearTimeout(timer)
        timer = setTimeout(function() {
            func(args)
        }, timeout)
    }
    Lib60870.prototype.EmitInformationObjects = function(informationObjects) {
        debounce(function() {
Lib60870.prototype.eventEmitter.emit('informationObjects', informationObjects)
}, 500)
    }
    Lib60870.prototype.ServerMode = {
        SINGLE_REDUNDANCY_GROUP : 1,
        CONNECTION_IS_REDUNDANCY_GROUP : 2,
        MULTIPLE_REDUNDANCY_GROUPS : 3
    }
    Lib60870.prototype.EnqueueMode = {
        REMOVE_OLDEST : 1,
        IGNORE : 2,
        THROW_EXCEPTION : 3
    }
    Lib60870.prototype.ClientConnectionEvent = {
        OPENED : 1,
        ACTIVE : 2,
        INACTIVE : 3,
        CLOSED : 4
    }
}
