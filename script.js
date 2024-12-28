const apiUrl = 'https://usmanlive.com/wp-json/api/stories';

$(document).ready(function () {
    
    $('#getData').click(function () {
        $.get(apiUrl, function (data) {
            $('#dataContainer').empty(); 
            if (data.length === 0) {
                $('#dataContainer').append('<p>No data found.</p>');
            } else {
                data.forEach(item => {
                    const dataItem = $(`
                        <div class="data-item">
                            <h3>${item.title}</h3>
                            <p>${item.description || 'No description available'}</p>
                            <div class="action-buttons">
                                <button class="edit-btn">Edit</button>
                                <button class="delete-btn">Delete</button>
                            </div>
                        </div>
                    `);

                    
                    dataItem.find('.delete-btn').click(function () {
                        $.ajax({
                            url: `${apiUrl}/${item.id}`,
                            type: 'DELETE',
                            success: function () {
                                dataItem.remove();
                                console.log('Item deleted successfully:', item);
                            },
                            error: function (error) {
                                console.error('Error deleting item:', error);
                            },
                        });
                    });

                    
                    dataItem.find('.edit-btn').click(function () {
                        const newTitle = prompt('Edit title:', item.title);
                        const newDescription = prompt('Edit description:', item.description || '');

                        if (newTitle && newDescription) {
                            $.ajax({
                                url: `${apiUrl}/${item.id}`,
                                type: 'PUT',
                                contentType: 'application/json',
                                data: JSON.stringify({
                                    title: newTitle,
                                    description: newDescription,
                                }),
                                success: function (updatedItem) {
                                    console.log('Item updated successfully:', updatedItem);
                                    dataItem.find('h3').text(updatedItem.title);
                                    dataItem.find('p').text(updatedItem.description || 'No description available');
                                },
                                error: function (error) {
                                    console.error('Error updating item:', error);
                                },
                            });
                        }
                    });

                    $('#dataContainer').append(dataItem);
                });
            }
        }).fail(function (error) {
            console.error('Error fetching data:', error);
        });
    });

    
    $('#addData').click(function () {
        const title = prompt('Enter title for new data:');
        const description = prompt('Enter description for new data:');

        if (title && description) {
            const newData = { title, description };

            $.post(apiUrl, JSON.stringify(newData), function (addedData) {
                console.log('Data added successfully:', addedData);
                $('#getData').trigger('click'); // Refresh data
            }).fail(function (error) {
                console.error('Error adding data:', error);
            });
        }
    });
});
