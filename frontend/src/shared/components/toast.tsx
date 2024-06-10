import Swal from "sweetalert2";

enum ToastType {
    SUCCESS, WARNING, INFO, ERROR
}

type CustomToastProps = {
    type: ToastType,
    title: string,
    message?: string

}

const getToastColor = (type: ToastType) => {
    switch(type) {
        case ToastType.SUCCESS:
            return '!bg-green-500'
        case ToastType.WARNING:
            return '!bg-yellow-500'
        case ToastType.INFO:
            return '!bg-blue-500'
        case ToastType.ERROR:
            return '!bg-red-500'
    }
}

const getToastIcon = (type: ToastType) => {
    switch(type) {
        case ToastType.SUCCESS:
            return 'success'
        case ToastType.WARNING:
            return 'warning'
        case ToastType.INFO:
            return 'info'
        case ToastType.ERROR:
            return 'error'
    }
}


const CustomToast = async (props: CustomToastProps) => {
    return await Swal.mixin({
        toast: true,
        position: 'top-right',
        color: 'white',
        iconColor: 'white',
        customClass: {
          popup: getToastColor(props.type),
        },
        icon: getToastIcon(props.type),
        title: props.title,
        text: props.message,
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      }).fire()   
}

export {CustomToast, ToastType}


