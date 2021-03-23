$(document).ready(function() {
   const apiRoot = 'http://localhost:8080/app/';
   const datatableRowTemplate = $('[data-datatable-row-template]').children()[0];
   const photosContainer = $('[data-photos-container]');

   //init
   getAllPhotos();

   function createElement(data) {
      var element = $(datatableRowTemplate).clone();

      element.attr('data-photo-id', data.id);
      element.find('[data-photo-name-section] [data-photo-name-paragraph]').text(data.name);
      element.find('[data-photo-name-section] [data-photo-name-input]').val(data.name);

      element.find('[data-photo-content-section] [data-photo-content-paragraph]').text(data.content);
      element.find('[data-photo-content-section] [data-photo-content-input]').val(data.content);

      return element;
   }

   function handleDatatableRender(data) {
      photosContainer.empty();
      data.forEach(function(photo) {
         createElement(photo).appendTo(photosContainer);
      });
   }

   function getAllPhotos() {
      var requestUrl = apiRoot + 'photos';

      $.ajax({
         url: requestUrl,
         method: 'GET',
         success: handleDatatableRender
      });
   }

   function handlePhotoDeleteRequest() {
      var parentEl = $(this).parents('[data-photo-id]');
      var photoId = parentEl.attr('data-photo-id');
      var requestUrl = apiRoot + 'photo';

      $.ajax({
         url: requestUrl + '/' + photoId,
         method: 'DELETE',
         success: function() {
            parentEl.slideUp(400, function() { parentEl.remove(); });
         }
      })
   }

   function handlePhotoSubmitRequest(event) {
      event.preventDefault();

      var form = $('#file_upload_form')[0];
      var data = new FormData(form);
      var requestUrl = apiRoot + 'photo';

      $.ajax({
         url: requestUrl,
         method: 'POST',
         enctype: 'multipart/form-data',
         data: data,
         processData: false,
         contentType: false,
         cache: false,
         timeout: 600000,
        complete: function(data) {
           if (data.status === 200) {
              getAllPhotos();
           }
        }
      });
   }

   $('[data-photo-add-form]').on('submit', handlePhotoSubmitRequest);
   photosContainer.on('click','[data-photo-delete-button]', handlePhotoDeleteRequest);
});